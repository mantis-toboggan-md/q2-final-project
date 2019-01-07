const knex = require("../db/knex.js")

module.exports = {

  getComp: (req,res)=>{
      knex('competitions').where('id', req.params.id)
        .then((competition)=>{
        knex('users_comps').where('comp_id', req.params.id).join('users', 'users.id', '=', 'users_comps.user_id')
          .then((users)=>{
          knex('comments').where('comp_id', req.params.id).join('users', 'comments.user_id', '=', 'users.id')
          .then((comments)=>{
            res.render('competition.ejs', {user: req.params.user, participants: users, comments: comments, competition: competition[0]})
          })
        })
      })
  },
}
