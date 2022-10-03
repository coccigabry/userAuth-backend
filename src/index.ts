import 'dotenv/config'; //------------replace import dotenv from 'dotenv' + dotenv.config()
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import { localUserInterface, IMongoDBlocalUser } from './LocalAuth/localTypes';
import { oauthUserInterface, IMongoDBoauthUser } from './oAuth/oauthTypes';
import localUser from './LocalAuth/localUser'
import oauthUser from './oAuth/oauthUser'



// DB connection
mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, (err) => {
  if (err) throw err;
  console.log("Connected to mongoose successfully")
});



// Middleware
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.static('public')); //------------ makes app contents publicly accessed

app.use(require('./LocalAuth/localMethod')); //------------ import local routes
app.use(require('./oAuth/oauthMethod')); //------------ import oauth routes

app.use(passport.initialize());
app.use(passport.session());



// Serialize & Deserialize
//---------------grab that user from database and return it like that instead of the entire profile
passport.serializeUser((user: any, done: any) => {
  return done(null, user);
});


passport.deserializeUser((id: string, cb: any) => {
  localUser.findOne({ _id: id }, (err: Error, user: IMongoDBlocalUser) => {
    if (err) throw (err);
    if (user) {
      const userInformation : localUserInterface = {
        username: user.username,
        isAdmin: user.isAdmin,
        id: user._id
      };
      cb(err, userInformation);
    } else {
      oauthUser.findById(id, (err: Error, doc: IMongoDBoauthUser) => {
        //------------Whatever we return goes to the client and binds to the req.user property
        return cb(null, doc);
      });
    }
  })    
});



// Global Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/user", (req, res) => {
  res.send(req.user);
});


const isAdministratorMiddleware = (req: Request, res: Response, next: Function) => {
  const { user } : any = req;
  if (user) {
    localUser.findOne({ username: user.username }, (err: Error, doc: IMongoDBlocalUser) => {
        if (err) throw err;
        if (doc?.isAdmin) {
          next();
        } else {
          oauthUser.findOne({ username: user.username }, (err: Error, doc: IMongoDBoauthUser) => {
            if (err) throw err;
            if (doc?.isAdmin) {
              next();
            } else {
              res.send("Only admin can perform this");
            }
          });
        }
    });
  } else {
    res.send("You are not logged in");
  }
};



app.post("/deleteuser", isAdministratorMiddleware, (req, res) => {
  const { id } = req?.body;
  localUser.findByIdAndDelete(id, (err: Error) => {
    if (err) throw err;
  });
  res.send("success");
});


app.get("/getallusers", isAdministratorMiddleware, (_, res) => {
  localUser.find({}, (err: Error, data: IMongoDBlocalUser[]) => {
    if (err) throw err;
    const filteredUsers : localUserInterface[] = [];
    data.forEach((item : IMongoDBlocalUser) => {
      const userInformation = {
        id: item._id,
        username: item.username,
        isAdmin: item.isAdmin
      }
      filteredUsers.push(userInformation);
    });
    res.send(filteredUsers);
  })
});


app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    };
    res.send('done');
  });
});


app.listen(process.env.PORT || 4000, () => {
  console.log("Server listening");
});
