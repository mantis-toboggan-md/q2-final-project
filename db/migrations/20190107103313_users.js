
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table=>{
    table.increments('id')
    table.string('username')
    table.string('email')
    table.string('password')
    table.integer('money')
    table.boolean('isAdmin')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
