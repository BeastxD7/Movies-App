const { Sequelize, DataTypes } = require('sequelize');

// Initialize a new Sequelize instance
const sequelize = new Sequelize('movie_db', 'beast', 'beast', {
  host: 'localhost', // This should match the service name in your Docker Compose file
  dialect: 'postgres',
  port: 5432 // Default PostgreSQL port
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define a model
const Movie = sequelize.define('Movie', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Movie table has been created.');
  })
  .catch(err => {
    console.error('Unable to create table:', err);
  });

module.exports = {
  sequelize,
  Movie
}
