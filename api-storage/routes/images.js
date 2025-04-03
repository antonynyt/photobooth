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


// router.get("/", Authorise(false), function (req, res, next) {
//   let query = Resultat.find()
//   if (req.query.utilisateurs) {
//     query = Resultat.find({ userID: req.query.utilisateurs })
//     if (req.query.parcours) {
//       query = Resultat.find({ userID: req.query.utilisateurs, trailID: req.query.parcours })
//     }
//   }

//   query.populate("trailID");

//   query.exec().then(resultats => {
//     res.send(resultats.map(resultat => {
//       if (req.query.utilisateurs) {
//         // console.log(resultat);
//         return {
//           id: resultat._id,
//           temps: resultat.temps,
//           parcours: {
//             id: resultat.trailID._id,
//             nom: resultat.trailID.nom,
//           }
//         };
//       }
//       // console.log(2);
//       return {
//         id: resultat._id,
//         temps: resultat.temps,
//       };
//     }));
//   })
//     .catch(next);
// });

// router.post("/", utils.requireJson, Authorise(true), function (req, res, next) {
//   req.body.userID = req.currentUser.id;
//   let resultat = new Resultat(req.body)
//   resultat.save()
//     .then(savedResultat => {
//       return res.status(201).send(savedResultat);
//     })
//     .catch(next);
// });

export default router;