import passport from 'passport';

// utility
import _ from 'lodash';

export default api => {
  // A POST /login route is created to handle login.
  api.post('/auth/login', (req, res, next) => {
    // handles authentication, have to deal with restful response in callback
    passport.authenticate('local', authCb)(req, res, next);

    function authCb(err, user) {
      if (err) {
        console.log(err);
        return next(err);
      }

      // if auth fails send back error
      if (!user)
        return res.status(401).json({
          status: 401,
          error: 'Invalid login credentials.'
        });

      // req.logIn will establish our session.
      req.logIn(user, loginErr => {
        if (loginErr) {
          console.log(loginErr);
          return next(loginErr);
        }

        // We respond with a response object that has user with _id and email.
        res.status(200).json(_.merge(_.omit(req.user.toObject(), ['password', 'salt']), {
          hasPassword: !!req.user.password
        }));
      });
    }
  });
};
