import Image from "../models/image.js";
import Booth from "../models/booth.js";

export default async function cleanUpDB() {
    await Promise.all([
        Image.deleteMany().exec(), 
        Booth.deleteMany().exec()
    ]);
}