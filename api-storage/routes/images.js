import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import Image from "../models/image.js";
import { VerifyKey } from "../utils/verifyKey.js";

const router = express.Router();
const app = express();
const server = createServer(app); // Wrap app with HTTP server
const io = new Server(server, { cors: { origin: "*" } });

server.listen(process.env.PORT || 4000, () => console.log(`Websocket running on port ${process.env.DATABASE_URL || 4000}`));

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

router.get("/:boothID/last", (req, res, next) => {
  const query = Image.findOne({boothID: req.params.boothID}).sort({number: -1});
  query.exec().then((image) => {
    if (!image) return res.status(404).send("No image was found");
    res.send(image);
  })
  .catch(next)
});

router.post("/", VerifyKey(), (req, res, next) => {
  const image = new Image(req.body);
  if (!image.boothID || !image.img) return res.status(400).send("Request body should contain boothID and img");
  image.save()
  .then(savedImage => {  
    console.log("savedImage :", savedImage);
    let binaryString = "";  
    for (let i = 0; i < savedImage.img.data; i++) {
      binaryString += String.fromCharCode(savedImage.img.data[i]);
    }
    console.log("binaryString :", binaryString);
    io.emit("newImage", savedImage); // Emit event when a new image is added
    return res.status(201).send(savedImage);
  })
  .catch(next);
});

export default router;