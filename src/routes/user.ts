import express from "express";
import passport from 'passport';

const router = express.Router();



  
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
export = router;
