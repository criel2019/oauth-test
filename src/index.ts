import express from 'express'
import mongoose, { Error } from 'mongoose';
import dotenv from "dotenv";
import config from './config/config'
import userRoutes from './routes/user'



dotenv.config();

const app = express()
app.set("trust proxy", 1);
mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to mongoose successfully")
});




app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})


// app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
//        const error = new Error('Not Found');
//        res.status(404).json({
//               message : error.message
//        });
// });

app.get("/getuser", (req, res) => {
   res.send(req.user);
})

app.get("/auth/logout", (req, res) => {
  // if (req.user) {
     req.logout();
     res.send("done");
   }
)

const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))