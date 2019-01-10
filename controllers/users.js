const knex = require("../db/knex.js")
const flash = require('connect-flash')
const moment = require('moment')

module.exports = {

  index: function (req, res) {
    if(!req.session.user){
      knex('competitions').where('isPublic', true).where('comp_status', 'ongoing').orderBy('pool', 'desc').then((results)=>{
        res.render('index.ejs', {pubComps: results, privComps: '', user:req.session.user, wins: ''})
      })
    } else {
      //get competition id's for all comps user is in
      knex('invites').where('username', req.session.user.username).orWhere('user_email', req.session.user.email).select('comp_id').then((ids) => {
        //knex query returns array of objects; get only objects values into an array
        let idArr = ids.map((obj) => {
          return obj.comp_id
        })
        //use that array of comp_id's to filter competition table
        knex('competitions').where('isPublic', false).where('comp_status', 'ongoing').whereIn('id', idArr).orderBy('pool', 'desc').then((results) => {
          //get all public competitions
          knex('competitions').where('isPublic', true).where('comp_status', 'ongoing').then((pubComps) => {
            knex('users_comps').where({
              user_id: req.session.user.id,
              status: 'won',
              isClaimed: false
            }).then((wins)=>{
              if(!wins[0]){
                wins = ''
              }
                res.render('index.ejs', { pubComps: pubComps, privComps: results, user:req.session.user, wins:wins })
            })
          })
        })
      })

    }
  },


  userLogin: (req, res) => {
    res.render('login', {user:req.session.user, messages:req.flash('info'), wins: ''})
  },


  login: (req, res) => {
    knex('users')
      .where('email', req.body.email)
      .then((results) => {
        if(!results[0]){
          req.flash('info', 'email not found')
          res.redirect('/login')
        }else{
          let user = results[0];
          let user_id = results[0].id;
          if (user.password === req.body.password) {
            req.session.user = user;

            req.session.save(() => {
              res.redirect('/');
            })
          } else {
            req.flash('info', 'password incorrect')
            res.redirect('/login');
          }
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

  profile: (req,res)=>{
    //get all of user's won competition relations
    knex('users_comps').where({
      user_id: req.session.user.id,
      status: 'won'
    }).join('competitions', 'competitions.id', '=', 'users_comps.comp_id')
      .then((wins)=>{
        wins.map((comp)=>{
          comp.updated_at = moment(comp.updated_at).format('MMMM DD, hh:mm a')
        })
      //get all lost competition relations
      knex('users_comps').where({
        user_id: req.session.user.id,
        status: 'lost'
      }).join('competitions', 'competitions.id', '=', 'users_comps.comp_id')
        .then((losses)=>{
          losses.map((comp)=>{
            comp.updated_at = moment(comp.updated_at).format('MMMM DD, hh:mm a')
          })
          //get all ongoing competition relations
          knex('users_comps').where({
            user_id: req.session.user.id,
            status: null
          }).join('competitions', 'competitions.id', '=', 'users_comps.comp_id').then((ongoing)=>{
            knex('users_comps').where({
              user_id: req.session.user.id,
              status: 'won',
              isClaimed: false
            }).then((userwins)=>{
              res.render('profile.ejs', {user:req.session.user, comp_wins:wins, losses:losses, ongoing:ongoing, wins:userwins})
            })
          })
      })
    })
  },

  claim: (req,res)=>{
    knex('users_comps').where({
      user_id: req.session.user.id,
      comp_id: req.params.id
    }).update({
      isClaimed: true
    }).then(()=>{
      knex('competitions').where('id', req.params.id).then((result)=>{
        //get number of winners by extracting ints from winners string
        let numWins = result[0].winners.match(/[0-9]/g).length
        let winnings = Math.floor(result[0].pool/numWins)
        knex.raw(
          `UPDATE users SET money = money + ${winnings} WHERE id=${req.session.user.id}`
        )
        .then(()=>{
          //update the session object to reflect changes made in db
          knex('users').where('id', req.session.user.id).then((user)=>{
            req.session.user = user[0]
          }).then(()=>{
            res.redirect('/profile')
          })
        })
      })
    })
  }



}
