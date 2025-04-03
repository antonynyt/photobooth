import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import Booth from "../models/booth.js";
import cleanUpDB from "../utils/cleanupDB.js";


beforeEach(cleanUpDB);

describe('POST /api/booths', function () {
    it('should create a booth', async function () {
        const booth = await supertest(app)
            .post('/api/booths')
            .send()
        expect(booth.status).toBe(201);
        expect(booth.body).toHaveProperty('id');
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);