module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './api/data/db.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './api/data/migrations'
    },
    seeds: {
      directory: './api/data/seeds'
    }
  }
};
