const knex = require("../db/knex.js")

module.exports = {
  
  index: function (req, res) {
    knex('users').then((result) => {
      res.render("index", { users: result });

    });
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


  successful_login: (req, res) => {
    knex('users')
      .where('email, req.session.email')
      .andWhere('password', 'req.session.password')
      .then((result) => {
        if (result.length === 0) {
          res.render('index', { users: result})
        } else {
          res.render('index', { users: result });
        }
      })
  }
  
}