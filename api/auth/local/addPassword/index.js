// models
import mongoose from 'mongoose';
const User = mongoose.model('User');

// utilities
import _ from 'lodash';

export default api => {
  // A POST /login route is created to handle login.
  api.post('/addPassword', (req, res, next) => {
    const {
      _id: userId,
      password
    } = req.body;

    // checks user id sent against session user id (basic security check)
    if(userId !== req.user._id.toString()) // need to "toString()" as it's a mongoose id on req.user
      return res.status(401).json({
        status: 401,
        error: 'You were trying to be sneaky weren\'t you!'
      });

    User.findById(userId)
      .then(user => _.merge(user, {password}).save())
      .then(() => res.status(200).send())
      .catch(err => next(err));
  });
};
