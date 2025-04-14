import express from "express";

import Booth from "../models/booth.js";

import { VerifyKey } from "../utils/verifyKey.js";

const router = express.Router();

router.post("/", VerifyKey(), (req, res, next) => {
  const booth = new Booth();
  booth.save().then(savedBooth => {
    return res.status(201).send(savedBooth);
  })
  .catch(next);
});

export default router;