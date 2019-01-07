
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', table=>{
    table.increments('id')
    table.integer('user_id')
    table.integer('comp_id')
    table.text('content')
    table.timestamps(true,true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments')
};
