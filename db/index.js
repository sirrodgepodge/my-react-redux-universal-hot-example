const mongoose = require('mongoose');
const chalk = require('chalk');

// begins connecting to mongo with connection string and gives us "connection" to listen to for events
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const db = mongoose.connect(URI).connection;

// register mongoose models
require('./models');

// log init
console.log(chalk.yellow('Opening connection to MongoDB at: ' + URI));

db.on('connected', () => console.log(chalk.blue('MongoDB connected!')));
db.on('open', () => console.log(chalk.green('Mongoose Models Loaded!'))); // happens after models are loaded
db.on('error', err => console.log(chalk.red(err)));
