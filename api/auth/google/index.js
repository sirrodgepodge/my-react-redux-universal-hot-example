// passport
import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';

// utilities
import _ from 'lodash';

// models
import mongoose from 'mongoose';
const User = mongoose.model('User');

const googleCredentials = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
};

// passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

const verifyCallback = (accessToken, refreshToken, profile, done) =>
  User.findOne({
    email: profile.emails[0].value
  })
  .then(user =>
    user && user.google._id ? Promise.resolve(user) : // no need to fill in info w/profile if user already has Google log-in
    _.merge(user || new User(), { // use Google profile to fill out user info if it does not already exist
      email: user && user.email || profile.emails[0].value,
      firstName: user && user.firstName || profile.name.givenName,
      lastName: user && user.lastName || profile.name.familyName,
      google: {
        _id: profile.id,
        photo: profile._json.image && profile._json.image.url || profile._json.picture, // this object path seems to vary
        link: profile._json.url || profile._json.link // this object path seems to vary
      }
    }).save())
  .then(user =>
    done(null, user))
  .catch(err =>
    !console.error('Error creating user from Google authentication', err) && done(err, null));

const passportAuth = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
});

const passportAuthCb = passport.authenticate('google', { failureRedirect: '/' });

const passportAuthCbCb = (req, res) => res.redirect('/');

export default api => {
  passport.use(new GoogleStrategy(googleCredentials, verifyCallback));
  api.get('/google', passportAuth);
  api.get('/google/callback', passportAuthCb, passportAuthCbCb);
};
