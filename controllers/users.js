const knex = require("../db/knex.js")
const flash = require('connect-flash')

module.exports = {

  index: function (req, res) {
    if(!req.session.user){
      knex('competitions').where('isPublic', true).orderBy('pool', 'desc').then((results)=>{
        res.render('index.ejs', {pubComps: results, privComps: '', user:req.session.user})
      })
    } else {
      //get competition id's for all comps user is in
      knex('invites').where('username', req.session.user.username).orWhere('user_email', req.session.user.email).select('comp_id').then((ids) => {
        //knex query returns array of objects; get only objects values into an array
        let idArr = ids.map((obj) => {
          return obj.comp_id
        })
        //use that array of comp_id's to filter competition table
        knex('competitions').where('isPublic', false).whereIn('id', idArr).orderBy('pool', 'desc').then((results) => {
          //get all public competitions
          knex('competitions').where('isPublic', true).then((pubComps) => {
            res.render('index.ejs', { pubComps: pubComps, privComps: results, user:req.session.user })
          })
        })
      })

    }
  },


  userLogin: (req, res) => {
    res.render('login', {user:req.session.user, messages:req.flash('info')})
  },


  login: (req, res) => {
    knex('users')
      .where('email', req.body.email)
      .then((results) => {
        let user = results[0];
        let user_id = results[0].id;
        if (user.password === req.body.password) {
          req.session.user = user;

          req.session.save(() => {
            res.redirect('/');
          })
        } else {
          res.redirect('/login');
        }
      }).catch(() => {
        res.redirect('/login')
      })
  },

  logout: (req, res) => {
    req.session.user = null;
    res.redirect('/login');
  },


  register: (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
      knex('users').where('username', req.body.username).then((result)=>{
        if(result[0]){
          req.flash('info', 'username taken!')
          res.redirect('/login')
        } else{
          knex('users').insert({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            money: 100,
            isAdmin: false
          }).then(() => {
            res.redirect('/login')
          });
        }
      })
    } else {
      req.flash('info', 'passwords do not match')
      res.redirect('/login')
    }
  },

  history: (req,res)=>{
    knex('users_comps').where({
      user_id: req.session.user.id,
      status: 'won'
    }).then((wins)=>{
      knex('users_comps').where({
        user_id: req.session.user.id,
        status: 'lost'
      }).then((losses)=>{
        res.render('history.ejs', {user:req.session.user, wins:wins, losses:losses})
      })
    })
  }



}
