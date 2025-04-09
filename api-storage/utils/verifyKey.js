import bcrypt from "bcrypt";
import { APIKey } from "../app.js";    

function VerifyKey() {
    return function VerifyKeyMidddleware(req, res, next) {
        const receivedKey = req.body.key;
        if (!receivedKey) {
            return res.status(400).send("API key is required");
        }
        bcrypt.compare(APIKey, receivedKey, function(err, result) {
            if (err) {
                return res.status(500).send("Error comparing password", err);
            }
            if (!result) {
                return res.status(401).send("Invalid API key");
            }
            next();
        });
    }
}

export { VerifyKey };