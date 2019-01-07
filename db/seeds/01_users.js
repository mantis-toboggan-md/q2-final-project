
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'admin',
          email: 'ad@min.com',
          password: 'password',
          money: 1000000000,
          isAdmin: true
        },
        {
          username: 'test1',
          email: 'test@one.com',
          password: 'password',
          money: 500,
          isAdmin: false
        },
        {
          username: 'test2',
          email: 'test@two.com',
          password: 'password',
          money: 100,
          isAdmin: false
        }
      ]);
    });
};
