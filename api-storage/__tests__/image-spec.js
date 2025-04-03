import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import Image from "../models/image.js";
import cleanUpDB from "../utils/cleanupDB.js";

beforeEach(cleanUpDB);

describe('', function() {
    it('should work', function() {
        expect(true).toEqual(true);
    });
});

describe('GET /api/images', function () {
    it('should have no images in return', async function () {
        const response = await supertest(app)
            .get('/api/images')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
});
        
describe('POST /api/images', function () {
    it('should create an image', async function () {
        const image = await supertest(app)
            .post('/api/images')
            .send({
                standID: '67ed284a6d40e8822c129b1d',
                img: {
                    data: 'data',
                    contentType: 'image'
                }
            })
        expect(image.status).toBe(201);
        expect(image.body.number).toBe(1);
        expect(image.body.img.data).toBe('data');
        expect(image.body.img.contentType).toBe('image');
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);