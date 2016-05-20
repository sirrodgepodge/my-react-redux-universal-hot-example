import mongoose from 'mongoose';
const User = mongoose.model('User');

// utility
import _ from 'lodash';

export default api => {
  api.post('/auth/signup', (req, res, next) =>
    User.findOne({email: req.body.email})
      .then(foundUser => foundUser ?
        Promise.reject({error: 'User Already Exists'}) :
        new User(req.body).save())
      .then(storedUser => req.logIn(storedUser, loginErr => {
        if (loginErr) {
          console.log(loginErr);
          return next(loginErr);
        }
        // We respond with a response object that has user with _id and email.
        res.status(200).send({
          user: _.omit(storedUser, ['password', 'salt'])
        });
      }))
      .catch(error => {
        error.status = 401;
        res.json({error});
      }));
};
