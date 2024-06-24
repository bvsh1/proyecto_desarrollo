import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import * as handlebars from "express-handlebars";
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';

import billRouter from './routes/bill.js';
import buyRouter from './routes/buy.js';
import userRouter from './routes/user.js';
import mainRouter from './routes/main.js';
import walletRoutes from './routes/wallet.js';
import productRoutes from './routes/products.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    defaultLayout: "index",
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(walletRoutes); 
app.use(productRoutes);
app.use(buyRouter);
app.use(billRouter);

mongoose
  .connect(process.env.URL_MONGO)
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch((error) => {
    console.error(`Connection refused: ${error}`);
  });

app.use('/bill', billRouter);
app.use('/buy', buyRouter);
app.use('/user', userRouter);
app.use('', mainRouter);

export { app };
