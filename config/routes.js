//Update the name of the controller below and rename the file.
const knex = require("../db/knex.js")
const users = require("../controllers/users.js");
const competitions = require('../controllers/competitions_controller.js')


module.exports = function(app){

  app.get('/', users.index);
  app.get('/login', users.userLogin);
  app.get('/logout', users.logout);

  app.get('/profile', users.profile)

  app.post('/login', users.login);
  app.post('/register', users.register);

  app.get('/new', authMiddleware, competitions.getNewComp)
  app.post('/competitions/new', competitions.postNewComp)
  app.get('/competitions/:id',competitionAuth, competitions.getComp)
  app.post('/competitions/:id/comment', authMiddleware, competitions.postComment)
  app.get('/competitions/:id/join', competitionAuth, competitions.join)
  app.post('/competitions/:id/arbiter', competitions.arbiter)
  app.get('/competitions/:id/complete', arbiterAuth, competitions.complete)
  app.get('/competitions/:id/winners', arbiterAuth, competitions.winners)
  app.post('/competitions/:id/winners', arbiterAuth, competitions.setWinners)

  app.get('/competitions/:id/claim', users.claim)

}



function authMiddleware(req, res, next) {
  if (!req.session.id) {
    res.redirect("/login");
  } else {
    next()
  }
}

function competitionAuth(req,res,next){
  knex('competitions').where('id', req.params.id)
  .then((competition)=>{
    //check if comp is private and if so, confirm user has access
    if(competition[0].isPublic){
      next()
    } else {
      knex('invites').where({
        comp_id: req.params.id,
        username: req.session.user.username
      }).orWhere({
        comp_id: req.params.id,
        user_email: req.session.user.email
      }).then(results=>{
        if(!results[0]){
          res.redirect('/login')
        } else{
          next()
        }
      })
    }
  })
}

function arbiterAuth(req,res,next){
  knex('competitions').where('id', req.params.id).then((competition)=>{
    if(req.session.user.username===competition[0].arbiter_name){
      next()
    } else {
      res.status(403).end()
    }
  })
}
