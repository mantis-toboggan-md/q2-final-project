const knex = require("../db/knex.js")

module.exports = {

  index: function (req, res) {
    if(!req.session.user){
      knex('competitions').where('isPublic', true).then((results)=>{
        res.render('index.ejs', {pubComps: results})
      })
    } else{
      //get competition id's for all comps user is in
      knex('users_comps').where('user_id', req.session.user.id).select('comp_id').then((ids)=>{
        //knex query returns array of objects; get only objects values into an array
        let idArr = ids.map((obj)=>{
          return obj.comp_id
        })
        //use that array of comp_id's to filter competition table
        knex('competitions').where('isPublic', false).whereIn('id', idArr).then((results)=>{
          //get all public competitions
          knex('competitions').where('isPublic', true).then((pubComps)=>{
            res.render('index.ejs', {pubComps: pubComps, privComps: results})
          })
        })
      })

    }
  },


  userLogin: (req, res) => {
    res.render('login')
  },


  login: (req, res) => {
    knex('users')
      .where('email', req.body.email)
      .then((results) => {
        let user = results[0];
        let user_id = results[0].id;
        if (user.password === req.body.password) {
          req.session.user = user;
          req.session.user_id = user_id;
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



  register: (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
      knex('users').insert({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        money: 100,
        isAdmin: false
      }).then(() => {
        res.redirect('/login')
      });
    } else {
      res.redirect('/login')
    }
  },



}
