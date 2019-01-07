const knex = require("../db/knex.js")

module.exports = {

  getPrivComp: (req,res)=>{
    knex('users_comps').where({
      comp_id: req.params.id,
      user_id: req.session.user.id
    }).then((results)=>{
      if(!results[0]){
        res.status(403).end()
      } else{
        knex('competitions').where('id', req.params.id).then((competition)=>{
          res.render('competition.ejs', {user: req.params.user, competition:competition[0]})
        })
      }
    })
  },

  getComp: (req,res)=>{
    knex('competitions').where('id', req.params.id).then((competition)=>{
      res.render('competition.ejs', {user: req.params.user, competition:competition[0]})
    })
  }

}
