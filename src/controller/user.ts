
import { IMongoDBUser } from "src/interfaces/user";
import passport, { serializeUser, Strategy } from 'passport';
import User from '../models/user';
import dotenv from "dotenv";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;




dotenv.config();


declare global {
  namespace Express {
      // tslint:disable-next-line:no-empty-interface
      interface AuthInfo {}
      // tslint:disable-next-line:no-empty-interface
      interface User extends IMongoDBUser {}

      interface Request {
          authInfo?: AuthInfo;
          user?: User;

          // These declarations are merged into express's Request type
          login(user: User, done: (err: any) => void): void;
          login(user: User, options: any, done: (err: any) => void): void;
          logIn(user: User, done: (err: any) => void): void;
          logIn(user: User, options: any, done: (err: any) => void): void;

          logout(): void;
          logOut(): void;

          isAuthenticated(): this is AuthenticatedRequest;
          isUnauthenticated(): this is UnauthenticatedRequest;
      }

      interface AuthenticatedRequest extends Request {
          user: User;
      }

      interface UnauthenticatedRequest extends Request {
          user?: undefined;
      }
  }
}



const serializeuser = (req, res, next) => { passport.serializeUser((user: IMongoDBUser, done: any) => {
  return done(null, user._id);
});
}
const desrializeuser = (req, res, next) => { passport.deserializeUser((id: string, done: any) => {

  User.findById(id, (err: Error, doc: IMongoDBUser) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(null, doc);
  })
})
}
const googleStrategy = (req, res, next) => { passport.use(new GoogleStrategy({
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
}







  const naverStrategy = (req, res, next) => { passport.use(new NaverStrategy({
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
}




const kakaoStrategy = (req, res, next) => { passport.use(new KakaoStrategy({
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
}


export = {serializeuser, desrializeuser, googleStrategy, naverStrategy, kakaoStrategy}

