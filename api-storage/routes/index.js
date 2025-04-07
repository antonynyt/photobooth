import express from "express";
import bcrypt from "bcrypt";
import { costFactor } from "../app.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Ignition!");
});

router.get("/test-hash", (req, res, next) => {
  res.send(bcrypt.hash( "gbmTRfznoOTbW3+otXshE3aaDvGeQTGknHgGcvxW/SD2Pbb7VzgKpZmevOG36kHB1d2M84lTpcGOJVZ/iD4i6A==", costFactor, function(err, hash) {   
    if (err) {
      console.error("Error hashing password:", err);
      return;
    }
    console.log("Hashed password:", hash);
  }));
});

export default router;