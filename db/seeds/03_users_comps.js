
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
          user_id: 1
        }
      ]);
    });
};
