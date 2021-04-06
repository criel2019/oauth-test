import express from 'express'
import cors from "cors"
import mongoose, { Error } from 'mongoose';
import dotenv from "dotenv";
import config from './config/config'
import userRoutes from './routes/user'
import session from 'express-session'
import passport from 'passport'
import Strategy  from './controller/user'

dotenv.config();

const app = express()
app.use(cors({ origin: "https://606c444912ad060007b009e5--awesome-goldberg-60d50e.netlify.app/", credentials: true }))

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

Strategy;

app.use('/user', userRoutes);

app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})


app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
       const error = new Error('Not Found');
       res.status(404).json({
              message : error.message
       });
});



const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))