import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import mongoose from 'mongoose';
const User = mongoose.model('User');

// I believe this gives us access to the "req.logIn" function
passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, strategyFn));

// When passport.authenticate('local') is used, this function will receive
// the email and password to run the actual authentication logic.
function strategyFn(email, password, done) {
  User.findOne({email})
    .then(user =>
      // user.correctPassword is a method from the User schema.
      !user || !user.correctPassword(password) ?
        done(null, false) :
        // Properly authenticated.
        done(null, user))
    .catch(err => done(err));
}
