import express from "express";
import mongoose from "mongoose";

import Image from "../models/image.js";

const router = express.Router();

router.get("/:id", (req, res, next) => {
  const query = Image.findById(req.params.id)
  query.exec().then((image) => {
    if (!image) return res.status(404).send("Image not found");
    res.send(image);
  })
  .catch(next);
});

router.get("/", (req, res, next) => {
  const query = Image.find();
  query.exec().then((images) => {
    if (!images) return res.status(404).send("No image was found");
    res.send(images);
  })
  .catch(next)
});

router.post("/", async (req, res, next) => {
  const image = new Image(req.body);
  if (!image.standID || !image.img) return res.status(400).send("Request body should contain standID and img");
  image.save()
  .then(savedImage => {
    return res.status(201).send(savedImage);
  })
  .catch(next);
});

router.delete("/:id", async (req, res, next) => {
  const query = Image.findByIdAndDelete(req.params.id)
  query.exec().then((image) => {
    if (!image) return res.status(404).send("Image not found");
    return res.status(200).send(image);
  })
  .catch(next);
});

export default router;