//Update the name of the controller below and rename the file.
const knex = require("../db/knex.js")
const users = require("../controllers/users.js");
const competitions = require('../controllers/competitions_controller.js')


module.exports = function(app){

  app.get('/', users.index);
  app.get('/login', users.userLogin);
  app.get('/logout', users.logout);

  app.post('/login', users.login);
  app.post('/register', users.register);

  app.get('/new', authMiddleware, competitions.getNewComp)
  app.get('/competitions/:id',competitionAuth, competitions.getComp)
  app.post('/competitions/:id/comment', authMiddleware, competitions.postComment)

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
        user_id: req.session.user.id
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
