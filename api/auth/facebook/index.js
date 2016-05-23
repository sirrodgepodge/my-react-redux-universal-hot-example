// passport
import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

// utilities
import _ from 'lodash';

// models
import mongoose from 'mongoose';
const User = mongoose.model('User');

const facebookCredentials = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK,
  profileFields: ['email', 'photos', 'link'] // this is the Google strategy's equivalent of "scope"
};

const verifyCallback = (accessToken, refreshToken, profile, done) =>
  User.findOne({
    'email': profile && profile.emails && profile.emails[0] && profile.emails[0].value
  })
  .then(user =>
    user && user.facebook._id ?
    Promise.resolve(user) : // no need to fill in profile if user already has Facebook log-in
    _.merge(user || new User(), { // use Facebook profile to fill out user info if it does not already exist
      email: user && user.email || profile && profile.emails && profile.emails[0] && profile.emails[0].value, // in case user has not provided email
      firstName: user && user.firstName || profile.name.givenName,
      lastName: user && user.lastName || profile.name.familyName,
      facebook: {
        _id: profile.id,
        photo: profile.photos[0].value,
        link: profile.profileUrl
      }
    }).save())
  .then(user =>
    done(null, user))
  .catch(err =>
    !console.error('Error creating user from Facebook authentication', err) && done(err, null));

passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

export default app => {
  app.get('/facebook',
    passport.authenticate('facebook', {scope: 'email'}));

  app.get('/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/',
      scope: 'email'
    }),
    (req, res) => {
      res.redirect('/');
    });
};
