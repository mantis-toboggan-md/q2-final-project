
exports.up = function(knex, Promise) {
  return knex.schema.createTable('invites', table=>{
    table.increments('id')
    table.integer('comp_id')
    table.string('username')
    table.string('user_email')
    table.timestamps(true,true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('invites')
};
