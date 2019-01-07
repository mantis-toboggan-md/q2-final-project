//Update the name of the controller below and rename the file.

const users = require("../controllers/users.js");
const competitions = require('../controllers/competitions_controller.js')


module.exports = function(app){

  app.get('/', users.index);
  app.get('/login', users.userLogin);
  app.get('/logout', users.logout);

  app.post('/login', users.login);
  app.post('/register', users.register);

  app.get('/competitions/:id', authMiddleware, competitions.getComp)

}



function authMiddleware(req, res, next) {
  if (!req.session.id) {
    res.redirect("/login");
  } else {
    next();
  }
}
