import express from "express";
var router = express.Router();
module.exports = function (passport) {

 

  router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://frontend-git-develop-advi22.vercel.app/testpage');
    });
  router.get('/auth/kakao', passport.authenticate('kakao'));

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://frontend-git-develop-advi22.vercel.app/testpage');
    });


  router.get('/auth/naver', passport.authenticate('naver'));

  router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://frontend-git-develop-advi22.vercel.app/testpage ');
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

  return router;
}