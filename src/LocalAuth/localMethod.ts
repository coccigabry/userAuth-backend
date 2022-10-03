import 'dotenv/config'; //------------replace import dotenv from 'dotenv' + dotenv.config()
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { IMongoDBlocalUser } from './localTypes';
import localUser from './localUser'
import bcrypt from 'bcryptjs';

const LocalStrategy = require('passport-local').Strategy;



// Middleware
const localRouter = express.Router();

localRouter.use(express.json());
localRouter.use(cors({ origin: "http://localhost:3000", credentials: true }))
localRouter.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
  })
);
localRouter.use(cookieParser());

localRouter.use(passport.initialize());
localRouter.use(passport.session());



// Strategies
passport.use(new LocalStrategy((username: string, password: string, done: any) => {
    localUser.findOne({ username: username }, (err: Error, user: IMongoDBlocalUser) => {
      console.log('local strategy begin');
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            };
      });
    });
}));



// Routes
localRouter.post("/register", async (req, res) => {
  const { username, password } = req?.body;
  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    res.send("Improper values");
    return;
  };
  localUser.findOne({ username }, async (err: Error, doc: IMongoDBlocalUser) => {
    if (err) throw err;
    if (doc) {
      return res.send("This user already exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new localUser({
        username,
        password: hashedPassword
      });
      await newUser.save();
      return res.send("success");
    };
  });
});


localRouter.post("/login", passport.authenticate('local'), (_, res) => {
  console.log('local login');
  res.send("success");
});



module.exports = localRouter;