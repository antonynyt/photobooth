import Image from "../models/image.js";
import Stand from "../models/stand.js";

export default async function cleanUpDB() {
    await Promise.all([
        Image.deleteMany().exec(), 
        Stand.deleteMany().exec()
    ]);
}