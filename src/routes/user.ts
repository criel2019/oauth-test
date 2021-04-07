import express from "express";
import passport from 'passport';
import cors from "cors"
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

import session from 'express-session'
import User from '../models/user';
import { IMongoDBUser } from "../interfaces/user";


const router = express.Router();



// Middleware changed  
router.use(express.json());
router.use(cors({ origin: "https://criel-front.netlify.app", credentials: true }))



router.use(
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
router.use(express.urlencoded({ extended: false }));
router.use(passport.initialize());
router.use(passport.session());




passport.serializeUser((user: IMongoDBUser, done: any) => {
  console.log('serializeUser', user)  
  return done(null, user._id);
});

passport.deserializeUser((id: string, done: any) => {
  console.log('deserializeUser', id)  
  User.findById(id, (err: Error, doc: IMongoDBUser) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(null, doc);
  })
})


passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "/auth/google/callback"
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
  callbackURL: "/auth/naver/callback"
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
  callbackURL: "/auth/kakao/callback"
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


router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  function (req, res) {
    res.redirect('https://criel-front.netlify.app');
  });
  router.get('/auth/kakao', passport.authenticate('kakao'));

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });
  
 
router.get('/auth/naver', passport.authenticate('naver'));

router.get('/auth/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/login', session: true }),
  function (req, res) {
    res.redirect('https://criel-front.netlify.app');
  });

router.get("/getuser", (req, res) => {
    res.send(req.user);
 })
 
 router.get("/auth/logout", (req, res) => {
   // if (req.user) {
      req.logout();
      res.send("done");
    }
 )

export = router;
