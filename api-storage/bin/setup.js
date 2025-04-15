#!/usr/bin/env node
//require: mongo db to be created and started first
import crypto from "crypto";
import readline from "readline";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Generate a random API key
const generateKey = () => crypto.randomBytes(24).toString("hex");

// Create a new booth ID
const createBoothId = async (mongoUri = "mongodb://localhost:27017") => {
    let client;
    try {
        // Connect to MongoDB using the connection string
        client = new MongoClient(mongoUri);
        await client.connect();

        // Insert a new booth document
        const db = client.db("photobooth");
        const result = await db.collection("booths").insertOne({});

        // Return the new booth ID
        return result.insertedId.toString();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        console.log("Using fallback random ID instead...");
        // Fallback to a random UUID-like string if MongoDB isn't available
        return crypto.randomUUID();
    } finally {
        if (client) await client.close();
    }
};

const setupEnvironment = async () => {
    console.log("🔧 Setting up Photobooth environment...");

    // Generate API key
    const apiKey = generateKey();
    console.log("✅ Generated backend key");

    // Generate bcrypt hash for frontend use
    const saltRounds = 10;
    const hashedKey = await bcrypt.hash(apiKey, saltRounds);
    console.log("✅ Generated bcrypt hash for frontend use");

    // Ask for MongoDB connection string
    rl.question("Enter MongoDB connection string (enter: mongodb://localhost:27017): ",
        async (mongoUri) => {
            const connectionString = mongoUri || "mongodb://localhost:27017";

            // Get or create boothID
            rl.question(
                "Do you want to create a new booth ID? (y/n) ",
                async (answer) => {
                    let boothId;

                    if (answer.toLowerCase() === "y") {
                        console.log(
                            `Connecting to MongoDB at: ${connectionString}`
                        );
                        boothId = await createBoothId(connectionString);
                        console.log(`✅ Created new booth ID: ${boothId}`);
                    } else {
                        rl.question("Enter existing booth ID: ", (id) => {
                            boothId = id;
                            printEnvFile(
                                apiKey,
                                boothId,
                                hashedKey,
                                connectionString
                            );
                        });
                        return;
                    }

                    printEnvFile(apiKey, boothId, hashedKey, connectionString);
                }
            );
        }
    );
};

const printEnvFile = (apiKey, boothId, hashedKey, mongoUri) => {
    console.log("✅ Created .env file with API key and booth ID");
    console.log("\n🚀 Setup complete!");

    // Display configuration information for the user
    console.log("\n============ CONFIGURATION DETAILS ============");
    console.log("For backend (.env):");
    console.log(`KEY=${apiKey}`);
    console.log(`BOOTHID=${boothId}`);
    console.log(`DATABASE_URL=${mongoUri}`);
    console.log("\nFor frontend authentication:");
    console.log(`Hashed key: ${hashedKey}`);
    console.log("==============================================");
    console.log("\nStore the hashed key in your frontend for API Environment.");

    rl.close();
};

setupEnvironment();
