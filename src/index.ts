import express from 'express'
import cors from "cors"
import mongoose, { Error } from 'mongoose';
import session from 'express-session';
import dotenv from "dotenv";
import passport from 'passport';
import User from './models/user';
import { IMongoDBUser } from './interfaces/user'
import userRoutes from './routes/user'

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
dotenv.config();

const app = express()
app.use(express.json())
// mongoose
// .connect(config.mongo.url, config.mongo.options)
// .then((result) => {
//        console.log('connected')
// })
// .catch((error) => {
//        console.log(error.message)
// });
mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to mongoose successfully")
});



// Middleware changed 
app.use(express.json());

app.use(cors({ origin: "https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app", credentials: true }))

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





passport.use(new GitHubStrategy({
  clientID: `${process.env.GITHUB_CLIENT_ID}`,
  clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
  callbackURL: "/auth/github/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ githubId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          githubId: profile.id,
          username: profile.username
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));






app.use(cors())
app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})


app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
       const error = new Error('Not Found');
       res.status(404).json({
              message : error.message
       });
});


app.use('/user', userRoutes);


const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))