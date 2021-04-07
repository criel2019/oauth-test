import express from 'express'
import mongoose, { Error } from 'mongoose';
import dotenv from "dotenv";
import config from './config/config'
import userRoutes from './routes/user'
import cors from "cors"


dotenv.config();

const app = express()
app.set("trust proxy", 1);
mongoose.connect(config.mongo.url, config.mongo.options,  
  () => {console.log("Connected to mongoose successfully")
});

app.use(cors({ origin: "https://criel-front.netlify.app", credentials: true }))


app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})


// app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
//        const error = new Error('Not Found');
//        res.status(404).json({
//               message : error.message
//        });
// });
app.get("/user", userRoutes)

const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))