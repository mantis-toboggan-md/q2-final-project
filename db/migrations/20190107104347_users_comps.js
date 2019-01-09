
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_comps', table=>{
    table.increments('id')
    table.integer('comp_id')
    table.integer('user_id')
    table.string('status')
    table.boolean('isClaimed')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_comps')
};
