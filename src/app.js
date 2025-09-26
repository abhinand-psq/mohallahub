import express from 'express';
import { router as auth } from './routes/Auth.js';
import { router as Test } from './routes/Test.js';
import cors from 'cors';
import morgon from 'morgan'
import cookieparse from 'cookie-parser';
import sample from './utils/check.js';
import { logger } from './utils/winston.js';
const app = express();


app.use(express.json({ limit: '36kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieparse())
app.use(cors({
  origin:process.env.cors?.split(' '),
  credentials:true,
  methods:['GET','POST','PUT','DELETE'],
  allowedHeaders:['Content-Type','Authorization']
}))

const middleware = morgon(":remote-addr :method :url :status :res[content-length] - :response-time ms",
{stream:{
  write: (message) => logger.info(message),
}}
)
app.use(middleware)
app.use('/auth', auth);
app.use('/signin',Test)

export default app;
