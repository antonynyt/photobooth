import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const boothSchema = new Schema({
});

// Customize the behavior of booth.toJSON() (called when using res.send)
boothSchema.set('toJSON', {
    transform: transformJsonBooth, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Removes extra MongoDB properties from serialized booths.
 */
function transformJsonBooth(doc, json, options) {
    // Remove MongoDB _id & __v (there's a default virtual "id" property)
    delete json._id;
    delete json.__v;

    return json;
}

export default mongoose.model('Booth', boothSchema);