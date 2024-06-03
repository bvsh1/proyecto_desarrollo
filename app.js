import express from "express";
import cookieParser from "cookie-parser";
import * as handlebars from "express-handlebars";
import mongoose from "mongoose";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";

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
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.URL_MONGO)
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch((error) => {
    console.error(`Connection refuse: ${error}`);
  });

export { app };