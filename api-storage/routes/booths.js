import express from "express";

import Booth from "../models/booth.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  const booth = new Booth(req.body);
  booth.save().then(savedBooth => {
    return res.status(201).send(savedBooth);
  })
  .catch(next);
});

export default router;