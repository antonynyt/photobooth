import express from "express";
import mongoose from "mongoose";

import Image from "../models/image.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const query = Image.findById(req.params.id);
    query.exec().then((image) => {
      if (!image) return res.status(404).send("Image not found");

      res.set("Content-Type", image.img.contentType); // Set correct MIME type
      res.send(image.img.data); // Send binary image data
    })
    .catch(next)
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = Image.find();
    query.exec().then((images) => {
      if (!images) return res.status(404).send("No image was found");

      // res.set("Content-Type", image.img.contentType); // Set correct MIME type
      res.send(images); // Send binary image data
    })
    .catch(next)
  } catch (error) {
    res.status(500).send("Error retrieving images");
  }
});

router.post("/", async (req, res, next) => {
  try {
    const image = new Image(req.body);
    if (!image.standID || !image.img) return res.status(400).send("Request body should contain standID and img");
    image.save()
    .then(savedImage => {
      return res.status(201).send(savedImage);
    })
    .catch(next);
  } catch (error) {
    return res.status(500).send({ error: "Error saving image", details: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).send("Image not found");
    res.status(200).send(image);
  } catch (error) {
    res.status(500).send("Error deleting image");
  }
});

export default router;