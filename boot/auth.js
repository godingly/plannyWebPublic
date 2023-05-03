var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');

const User = require('../models/user');
const authRouter = require('../routes/auth');


module.exports = function (app) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const newUser = {googleId: profile.id, email: profile.emails[0].value};
        try {
          //find the user in our database 
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            //If user present in our database.
            done(null, user)
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  });

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    })
  )
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login' ,(req, res) => {
    res.render('login', {title:'planny'});
  });
  

  app.use('/auth', authRouter);


  app.use(function ensureAuth (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else 
      res.redirect('/login');
  });
  

};