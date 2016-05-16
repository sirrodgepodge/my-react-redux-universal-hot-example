import mongoose from 'mongoose';
import Promise from 'bluebird';
import chalk from 'chalk';

// make mongoose use bluebird promises
mongoose.Promise = Promise;

// begins connecting to mongo with connection string and gives us "connection" to listen to for events
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/universalHotExample';
const db = mongoose.connect(URI).connection;

// register mongoose models
require('require-dir')('./models', {recurse: true});

// log init
console.log(chalk.yellow(`Opening connection to MongoDB at: ${URI}`));

export default new Promise((resolve, reject) => {
  db.on('connected', () => console.log(chalk.blue('MongoDB connected!')));
  db.on('open', () => !console.log(chalk.green('Mongoose Models Loaded!')) && resolve()); // happens after models are loaded
  db.on('error', err => !console.log(chalk.red(err)) && reject(err));
});
