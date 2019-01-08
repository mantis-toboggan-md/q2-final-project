
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('competitions').del()
    .then(function () {
      // Inserts seed entries
      return knex('competitions').insert([
        {
          duration: 3,
          bet_min: 10,
          pool: 0,
          title: 'test bet please ignore',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 2,
          arbiter_name: 'admin',
          bet_min: 10,
          status: 'ongoing',
          isPublic: true
        },
        {
          duration: 7,
          bet_min: 100,
          pool: 500,
          title: 'test bet please ignore',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 1,
          arbiter_name: 'test1',
          bet_min: 100,
          status: 'ongoing',
          isPublic: false
        }
      ]);
    });
};
