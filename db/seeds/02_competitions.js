
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
          arbiter_id: 1,
          isPublic: true
        }
      ]);
    });
};
