// models
import mongoose from 'mongoose';
const User = mongoose.model('User');

// utility
import _ from 'lodash';

export default api => {
  api.post('/auth/signup', (req, res, next) =>
    User.findOne({email: req.body.email})
      .then(foundUser => !foundUser ?
        new User(req.body).save() :
        !foundUser.password && foundUser.facebook || !foundUser.password && foundUser.google ?
        Promise.reject({error: 'It looks as though you\'ve signed up through Facebook or Google, log with that method and add a password to your account if you\'d like', status: 401}) :
        Promise.reject({error: 'A user with this email already exists', status: 401}))
      .then(storedUser => req.logIn(storedUser, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        // We respond with a response object that has user with _id and email.
        res.status(200).json(_.merge(_.omit(req.user.toObject(), ['password', 'salt']), {
          hasPassword: !!req.user.password
        }));
      }))
      .catch(error => error ?
        res.status(401).json(error) : null));
};
