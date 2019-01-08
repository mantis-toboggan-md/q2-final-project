const knex = require("../db/knex.js")

module.exports = {

  getComp: (req,res)=>{
      knex('competitions').where('id', req.params.id)
        .then((competition)=>{
        knex('users_comps').where('comp_id', req.params.id).join('users', 'users.id', '=', 'users_comps.user_id')
          .then((users)=>{
          knex('comments').where('comp_id', req.params.id).join('users', 'comments.user_id', '=', 'users.id')
          .then((comments)=>{
            res.render('competition.ejs', {user: req.session.user, participants: users, comments: comments, competition: competition[0]})
          })
        })
      })
    },

  postComment: (req,res)=>{
    knex('comments').insert({
      user_id: req.session.user.id,
      comp_id: req.params.id,
      content: req.body.content
    }).then(()=>{
      res.redirect(`/competitions/${req.params.id}`)
    })
  },

  getNewComp: (req,res)=>{
    res.render('newCompetition.ejs', {user:req.session.user})
  },

  postNewComp: (req,res)=>{

    knex('competitions').insert({
      title: req.body.title,
      description: req.body.description,
      isPublic: req.body.isPublic,
      bet_min: req.body.bet_min,
      creator_id: req.session.user.id,
      duration: req.body.duration,
      pool: 0,
      arbiter_id: req.session.user.id
    }).then(()=>{
      res.redirect('/')
  },

  join: (req,res)=>{
    knex('users_comps').insert({
      comp_id: req.params.id,
      user_id: req.session.user.id
    }).then(()=>{
      res.redirect(`/competitions/${req.params.id}`)
    })
  }
}
