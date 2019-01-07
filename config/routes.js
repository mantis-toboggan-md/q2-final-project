//Update the name of the controller below and rename the file.

const users = require("../controllers/users.js");


module.exports = function(app){

  app.get('/', users.index);
  app.get('/login', users.userLogin);

  app.post('/login', users.login);
  app.post('/register', users.register);

  app.use(authMiddleware);
  app.get('/', users.successful_login);

}



function authMiddleware(req, res, next) {
  if (!req.session.id) {
    res.redirect("/login");
  } else {
    next();
  }
}