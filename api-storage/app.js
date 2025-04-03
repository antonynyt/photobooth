import express from "express";
import createError from "http-errors";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import boothsRouter from "./routes/booths.js";
import imagesRouter from "./routes/images.js";

import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/');

const app = express();

//api documentation
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

//cors
const corsOptions = {
  origin: 'https://whynotyou-frontend.onrender.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api/booths", boothsRouter);
app.use("/api/images", imagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
