const knex = require('knex')

module.exports = {
  index: (req,res)=>{
    res.render('index.ejs')
  }
}
