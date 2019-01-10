const knex = require("../db/knex.js")
const moment = require('moment')

module.exports = {

  getComp: (req,res)=>{
      knex('competitions').where('id', req.params.id)
        .then((competition)=>{
          competition[0].created_at = moment(competition[0].created_at).format('MMMM DD, hh:mm a')
        knex('users_comps').where('comp_id', req.params.id).join('users', 'users.id', '=', 'users_comps.user_id')
          .then((users)=>{
          knex('comments').where('comp_id', req.params.id).join('users', 'comments.user_id', '=', 'users.id')
          .then((comments)=>{
            comments.map((comment)=>{
              comment.created_at = moment(comment.created_at).format('MMMM DD, hh:mm a')
            })
            knex('users').then((allusers)=>{
              let user = req.session.user || {id: null}
              knex('users_comps').where({
                user_id: user.id,
                status: 'won',
                isClaimed: false
              }).then((wins)=>{
                res.render('competition.ejs', {user: req.session.user, participants: users, comments: comments, competition: competition[0], users:allusers, wins:wins, messages:req.flash('info')})
              })
            })
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
    knex('users_comps').where({
      user_id: req.session.user.id,
      status: 'won',
      isClaimed: false
    }).then((wins)=>{
      res.render('newCompetition.ejs', {user:req.session.user, wins:wins})
    })
  },

  postNewComp: (req,res)=>{
    //separate invites string by commas and remove spaces to get an array of usernames and emails
    let invites = req.body.invites.split(',').map((word)=>{
      return word.trim()
    })
    knex('competitions').insert({
      title: req.body.title,
      description: req.body.description,
      isPublic: req.body.isPublic,
      bet_min: req.body.bet_min,
      creator_id: req.session.user.id,
      duration: req.body.duration,
      pool: 0,
      arbiter_name: req.session.user.username,
      comp_status: 'ongoing'
    }).returning('id')
      .then((result)=>{
      //returning gives id of newly created row; use to update invites table
      //always invite whomever started the comp
      knex('invites').insert({
        comp_id: result[0],
        username: req.session.user.username
      })
        .then(()=>{
        let inviteObjs = []
        invites.map((word)=>{
          //if invite name is an email, insert as email param
          if(word.includes('@')){
            inviteObjs.push({
              comp_id: result[0],
              user_email: word
            })
          } else {
            //if invite name is username, insert as username param
            inviteObjs.push({
              comp_id: result[0],
              username: word
            })
          }
        })
        knex('invites').insert(inviteObjs)
          .then(()=>{
          res.redirect('/')
        })
      })
    })
  },

  join: (req,res)=>{
    knex('users_comps').where({
      comp_id: req.params.id,
      user_id: req.session.user.id
    }).then((result)=>{
      knex('users').where('id', req.session.user.id).then((user)=>{
        knex('competitions').where('id', req.params.id).then((comp)=>{
          if(user[0].money < comp[0].bet_min || result[0] || req.body.bet_amt < comp[0].bet_min){
            req.flash('info', "can't let you do that, starfox")
            res.redirect(`/competitions/${req.params.id}`)
          }
          else {
            knex.raw(
              `UPDATE users SET money = money - ${req.body.bet_amt} WHERE id = ${req.session.user.id}`
            ).then(() => {
              knex.raw(
                `UPDATE competitions SET pool = pool + ${req.body.bet_amt} WHERE id = ${req.params.id}`
              ).then(() => {
                knex('users_comps').insert({
                  comp_id: req.params.id,
                  user_id: req.session.user.id
                }).then(()=>{
                  knex('users').where('id', req.session.user.id).then((results)=>{
                    req.session.user = results[0]
                  }).then(()=>{
                    res.redirect(`/competitions/${req.params.id}`)
                  })
                })
              })
            })
          }
        })
      })
    })
  },

  arbiter: (req,res)=>{
    knex('competitions').where('id', req.params.id).update({
      arbiter_name: req.body.arbiter
    }).then(()=>{
      knex('invites').insert({
        comp_id: req.params.id,
        username: req.body.arbiter
      }).then(()=>{
        res.redirect(`/competitions/${req.params.id}`)
      })
    })
  },

  complete: (req,res)=>{
    knex('competitions').where('id', req.params.id).update({
      comp_status: 'complete'
    }).then(()=>{
      res.redirect(`/competitions/${req.params.id}/winners`)
    })
  },

  winners: (req,res)=>{
    knex('users_comps').where('comp_id', req.params.id).join('users', 'users.id', '=', 'users_comps.user_id').then((results)=>{
      knex('competitions').where('id', req.params.id).then((comp)=>{
        knex('users_comps').where({
          user_id: req.session.user.id,
          status: 'won',
          isClaimed: false
        }).then((wins)=>{
          res.render('winners.ejs', {user:req.session.user, participants:results, competition:comp[0], wins:wins})
        })
      })
    })
  },

  setWinners: (req,res)=>{
    //winnerArr is array of winners' ids
    let winnerArr = Object.keys(req.body).map((key)=>parseInt(key))
    knex('competitions').where('id', req.params.id).update({
      winners: winnerArr,
      updated_at: knex.fn.now()
    }).returning('id').then((comp)=>{
      //update users_comps status for all winners
      knex('users_comps').where('comp_id', comp[0]).whereIn('user_id', winnerArr).update({
        status: 'won',
        isClaimed: false
      }).then(()=>{
        //update users_comps for loooooooosers
        knex('users_comps').where('comp_id', comp[0]).whereNotIn('user_id', winnerArr).update(
          'status', 'lost'
        ).then(()=>{
          res.redirect(`/competitions/${req.params.id}`)
        })
      })
    })
  }
}
