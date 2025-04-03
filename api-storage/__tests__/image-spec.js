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

describe('five times POST /api/images and GET /api/images/:boothID/last', function () {
    it('should create five images and find the last created', async function () {
        for (let i = 1; i <= 5; i++) {
            await supertest(app)
                .post('/api/images')
                .send({
                    boothID: '67ed284a6d40e8822c129b1d',
                    img: {
                        data: 'data' + i,
                        contentType: 'image'
                    }
                })
        }
        const image = await supertest(app)
            .get('/api/images/67ed284a6d40e8822c129b1d/last')
        expect(image.status).toBe(200);
        expect(image.body.number).toBe(5);
        expect(image.body.img.data).toBe('data5');
        expect(image.body.img.contentType).toBe('image');
    });
});
        
describe('POST /api/images', function () {
    it('should create an image', async function () {
        const image = await supertest(app)
            .post('/api/images')
            .send({
                boothID: '67ed284a6d40e8822c129b1d',
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
        
describe('POST /api/images and GET /api/images/:id', function () {
    it('should create an image', async function () {
        const createdImage = await supertest(app)
            .post('/api/images')
            .send({
                boothID: '67ed284a6d40e8822c129b1d',
                img: {
                    data: 'data',
                    contentType: 'image'
                }
            })
        expect(createdImage.status).toBe(201);
        expect(createdImage.body.number).toBe(1);
        expect(createdImage.body.img.data).toBe('data');
        expect(createdImage.body.img.contentType).toBe('image');
        const image = await supertest(app)
            .get('/api/images/' + createdImage.body.id)
        expect(image.status).toBe(200);
        expect(image.body.number).toBe(1);
        expect(image.body.img.data).toBe('data');
        expect(image.body.img.contentType).toBe('image');
    });
});

describe('POST /api/images and DELETE /api/images/:id', function () {
    it('should create and delete an image', async function () {
        const image = await supertest(app)
            .post('/api/images')
            .send({
                boothID: '67ed284a6d40e8822c129b1d',
                img: {
                    data: 'data',
                    contentType: 'image'
                }
            })
        expect(image.status).toBe(201);
        expect(image.body.number).toBe(1);
        expect(image.body.img.data).toBe('data');
        expect(image.body.img.contentType).toBe('image');

        const deleteImage = await supertest(app)
            .delete('/api/images/' + image.body.id)
        expect(deleteImage.status).toBe(200);
        expect(image.body.number).toBe(1);
        expect(image.body.img.data).toBe('data');
        expect(image.body.img.contentType).toBe('image');
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);