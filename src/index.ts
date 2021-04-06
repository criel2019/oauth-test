import express from 'express'
import cors from "cors"
import mongoose, { Error } from 'mongoose';
import dotenv from "dotenv";
import config from './config/config'
import userRoutes from './routes/user'
import session from 'express-session'
import passport from 'passport';
import User from './models/user';
import { IMongoDBUser } from "./interfaces/user";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

dotenv.config();

const app = express()

 mongoose
 .connect(config.mongo.url, config.mongo.options)
 .then((result) => {
        console.log('connected')
 })
 .catch((error) => {
        console.log(error.message)
 });



// Middleware changed 
app.use(express.json());
app.use(cors({ origin: "https://criel-front.netlify.app", credentials: true }))

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user: IMongoDBUser, done: any) => {
  return done(null, user._id);
});

passport.deserializeUser((id: string, done: any) => {

  User.findById(id, (err: Error, doc: IMongoDBUser) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(null, doc);
  })
})

passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "/user/auth/google/callback"
},

 function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          googleId: profile.id,
          username: profile.name.givenName
        });

        await newUser.save();
        cb(null, newUser);

      }
      cb(null, doc);



    })

  }));







 passport.use(new NaverStrategy({
  clientID: `xeiJ4Etz63ZzWGd_3ODf`,
  clientSecret: `i25diPbhrQ`,
  callbackURL: "/user/auth/naver/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ naverId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          naverId: profile.id,
          username: profile.username
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));





passport.use(new KakaoStrategy({
  clientID: `${process.env.Kakao_CLIENT_ID}`,
  clientSecret: `${process.env.Kakao_CLIENT_SECRET}`,
  callbackURL: "/user/auth/kakao/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ kakaoId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          kakaoId: profile.id,
          username: profile.username
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));


app.get('user/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('user/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  function (req, res) {
    res.redirect('https://criel-front.netlify.app');
  });
  app.get('/auth/kakao', passport.authenticate('kakao'));

  app.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });
  
 
app.get('/auth/naver', passport.authenticate('naver'));

app.get('/auth/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/login', session: true }),
  function (req, res) {
    res.redirect('https://criel-front.netlify.app');
  });



app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})


app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
       const error = new Error('Not Found');
       res.status(404).json({
              message : error.message
       });
});

app.get("/getuser", (req, res) => {
  res.send(req.user);
})

app.get("/auth/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
})

const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))