
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_comps').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_comps').insert([
        {
          comp_id: 1,
          user_id: 2
        },
        {
          comp_id: 1,
          user_id: 3
        },
        {
          comp_id: 2,
          user_id: 1,
          status: 'won',
          isClaimed: false
        },
        {
          comp_id: 2,
          user_id: 2,
          status: 'lost'
        },
        {
          comp_id: 3,
          user_id: 1
        },
        {
          comp_id: 3,
          user_id: 2
        },
        {
          comp_id: 4,
          user_id: 2,
          status: 'won',
          isClaimed: true
        },
        {
          comp_id: 5,
          user_id: 2,
          status: 'won',
          isClaimed: false
        }
      ]);
    });
};
