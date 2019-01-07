//Update the name of the controller below and rename the file.
const login_controllers = require("../controllers/login_controllers.js")
module.exports = function(app){

  app.get('/', login_controllers.index);

}
