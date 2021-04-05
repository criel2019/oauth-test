import express from "express";
import controller from "../controller/user";
import passport from 'passport';
const router = express.Router();


router.get('/getuser', controller.getuser);
router.get('/auth/logout', controller.logout);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: true }), controller.googleCallback);
router.get('/auth/kakao', passport.authenticate('kakao'));
router.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/login', session: true }), controller.kakaoCallback);
router.get('/auth/naver', passport.authenticate('naver'));
router.get('/auth/naver/callback', passport.authenticate('naver', { failureRedirect: '/login', session: true }), controller.naverCallback);
export = router;
