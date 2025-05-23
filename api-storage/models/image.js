import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    boothID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Booth',
        required: true,
    },
    number: {
        type: Number,
        min : 1,
        unique: true,
    },    
    img: { 
        type: String, 
        required: true 
    }
});

imageSchema.pre('save', function (next) {
    if (!this.isNew) return next(); // Skip if not a new document

    this.constructor.findOne().sort({ number: -1 }).then(lastImage => {
        this.number = lastImage ? lastImage.number + 1 : 1;
        next();
    }).catch(next);
});

// Customize the behavior of image.toJSON() (called when using res.send)
imageSchema.set('toJSON', {
    transform: transformJsonImage, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Removes extra MongoDB properties from serialized images.
 */
function transformJsonImage(doc, json, options) {
    // Remove MongoDB _id & __v (there's a default virtual "id" property)
    delete json._id;
    delete json.__v;
    return json;
}

export default mongoose.model('Image', imageSchema);