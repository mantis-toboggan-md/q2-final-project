
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('invites').del()
    .then(function () {
      // Inserts seed entries
      return knex('invites').insert([
        {
          comp_id: 3,
          username: 'test1',
        },
        {
          comp_id: 3,
          username: 'admin'
        },
        {
          comp_id: 4,
          username: 'admin'
        },
        {
          comp_id: 4,
          username: 'test1'
        },
        {
          comp_id: 5,
          username: 'test1'
        },
        {
          comp_id: 5,
          username: 'admin'
        }
      ]);
    });
};
