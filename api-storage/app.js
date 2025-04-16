import express from "express";
import createError from "http-errors";
import logger from "morgan";
import cors from "cors";
import { key } from "./config.js";
import http from "node:http";
import { Server } from "socket.io";

export const APIKey = key;

import indexRouter from "./routes/index.js";
import boothsRouter from "./routes/booths.js";
import imagesRouter from "./routes/images.js";

import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/');

const app = express();

// Create HTTP server
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket.io client connected');
  
  socket.on('disconnect', () => {
    console.log('Socket.io client disconnected');
  });
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//cors
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "*",
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

export { app, httpServer };
