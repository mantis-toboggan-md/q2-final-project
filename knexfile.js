module.exports = {
  development: {
      client: 'pg',
      connection: {
        database: "you_bet",
        host: "localhost",
        // user: 'nancy',
        // password: 'ginger'
      },
      migrations: {
          directory: __dirname + '/db/migrations',
        },
      seeds: {
          directory: __dirname + '/db/seeds',
        },
    },
  production: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
          directory: __dirname + '/db/migrations',
        },
      seeds: {
          directory: __dirname + '/db/seeds/production',
        },
    },
};
