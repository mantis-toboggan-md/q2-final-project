
exports.up = function(knex, Promise) {
  return knex.schema.createTable('competitions', table=>{
    table.increments('id')
    table.integer('duration')
    table.integer('bet_min')
    table.integer('pool')
    table.string('title')
    table.text('description')
    table.integer('creator_id')
    table.string('arbiter_name')
    table.string('status')
    table.boolean('isPublic')
    table.timestamps(true,true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('competitions')
};
