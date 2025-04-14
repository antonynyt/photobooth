import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Ignition!");
});

export default router;