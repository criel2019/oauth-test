import express from "express";
import passport from 'passport';

import session from 'express-session'



const router = express.Router();



// Middleware changed  
router.use(express.json());




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






router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
  function (req, res) {
    res.redirect('https://criel-front.netlify.app');
  });
  router.get('/auth/kakao', passport.authenticate('kakao'));

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });
  
 
router.get('/auth/naver', passport.authenticate('naver'));

router.get('/auth/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
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
