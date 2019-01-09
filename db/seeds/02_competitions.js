
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('competitions').del()
    .then(function () {
      // Inserts seed entries
      return knex('competitions').insert([
        {
          duration: 3,
          bet_min: 10,
          pool: 100,
          title: 'test bet please ignore',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 2,
          arbiter_name: 'admin',
          bet_min: 10,
          comp_status: 'ongoing',
          isPublic: true
        },
        {
          duration: 5,
          bet_min: 100,
          pool: 500,
          title: 'something something title',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 1,
          arbiter_name: 'test1',
          bet_min: 50,
          comp_status: 'complete',
          isPublic: true,
          winners: '{"1"}'
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
          comp_status: 'ongoing',
          isPublic: false
        },
        {
          duration: 5,
          bet_min: 20,
          pool: 100,
          title: 'another competition',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 1,
          arbiter_name: 'test2',
          bet_min: 100,
          comp_status: 'complete',
          isPublic: false
        },
        {
          duration: 5,
          bet_min: 20,
          pool: 100,
          title: 'another another competition',
          description: 'Do a thing. If you do it bad, you lose.',
          creator_id: 1,
          arbiter_name: 'test2',
          bet_min: 100,
          comp_status: 'complete',
          isPublic: false,
          winners: '{"2"}'
        },
        {
          duration: 30,
          bet_min: 100,
          pool: 100,
          title: 'Diet Bet',
          description: 'Lose weight and make $$.',
          creator_id: 1,
          arbiter_name: 'cortes1',
          bet_min: 10,
          comp_status: 'ongoing',
          isPublic: true
        }
      ]);
    });
};
