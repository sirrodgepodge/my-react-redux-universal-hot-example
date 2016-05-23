import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);
import _ from 'lodash';
import passport from 'passport';
import mongoose from 'mongoose';
const User = mongoose.model('User');


export default api => {
  // First, our session middleware will set/read sessions from the request.
  // Our sessions will get stored in Mongo using the same connection from
  // mongoose. Check out the sessions collection in your MongoCLI.
  api.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24) // stores cookie for one day (so if they revisit they'll still be loggd in)
    },
    resave: false,
    saveUninitialized: false, // store uninitialized sessions
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      touchAfter: 60 * 60 * 24 // resaves session after a day
    })
  }));

  // Initialize passport and also allow it to read
  api.use(passport.initialize());

  // Read request session information.
  api.use(passport.session());

  // When we give a cookie to the browser, it is just the userId (encrypted with our secret).
  passport.serializeUser((user, done) => done(null, user._id));

  // When we receive a cookie from the browser, we check the sessions collection for that id, then retrieve the corresponding user and set them as req.user.
  passport.deserializeUser((id, done) =>
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => console.log(err)));

  // Gets user off session if logged in (checked upon initial get request)
  api.get('/session', (req, res) =>
    !req.user ?
    res.status(200).json(null) : // need to keep status 200 for isomorphic logic to work
    res.status(200).json(_.merge(_.omit(req.user.toObject(), ['password', 'salt']), {
      hasPassword: !!req.user.password
    }))
  );

  // Simple /logout route.
  api.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).end();
  });
};
