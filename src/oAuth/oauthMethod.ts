import 'dotenv/config'; //-----------replace import dotenv from 'dotenv' + dotenv.config()
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { IMongoDBoauthUser } from './oauthTypes';
import oauthUser from './oauthUser'

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;



// Middleware
const oauthRouter = express.Router();

oauthRouter.use(express.json());
oauthRouter.use(cors({ origin: "http://localhost:3000", credentials: true }));

oauthRouter.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    //-------If you have cookie.secure set to true and you're NOT using SSL (i.e. https protocol),
    //-------then the cookie with the session id is not returned to the browser and everything fails silently.
    /*cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }*/
  })
);

oauthRouter.use(passport.initialize());
oauthRouter.use(passport.session());



// Strategies
//--------------------------------------SECOND STEP: authenticating
passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
  }, //--------------------------------------THIRD STEP: authentication successfull, call this function
  function (_: any, __: any, profile: any, cb: any) { 
    oauthUser.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBoauthUser) => {
      if (err) {
        return cb(err, null);
      };
      if (!doc) {
        const newUser = new oauthUser({
          googleId: profile.id,
          username: profile.displayName
        });
        await newUser.save();
        cb(null, newUser);
      };
      cb(null, doc);
    });
  }
));
  
  
  
passport.use(new FacebookStrategy({
    clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
    clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
    callbackURL: '/auth/facebook/callback'
  }, 
  function (_: any, __: any, profile: any, cb: any) {     
    oauthUser.findOne({ facebookId: profile.id }, async (err: Error, doc: IMongoDBoauthUser) => {
      if (err) {
        return cb(err, null);
      };
      if (!doc) {
        const newUser = new oauthUser({
          facebookId: profile.id,
          username: profile.displayName
        });
        await newUser.save();
        cb(null, newUser);
      };
      cb(null, doc);
    });
  }
));



// Routes
//--------------------------------------FIRST STEP: run the get request
oauthRouter.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile'] }));
//--------------------------------------FOURTH STEP: start redirect, whatever happens on step 3
oauthRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }), 
  function (req, res) {
    console.log('oauth callback redirecting');
    res.redirect('http://localhost:3000/profile');
  }
);


oauthRouter.get('/auth/facebook', 
  passport.authenticate('facebook'));

oauthRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: true }), 
  function (req, res) {
    res.redirect('http://localhost:3000/profile');
  }
);



module.exports = oauthRouter;