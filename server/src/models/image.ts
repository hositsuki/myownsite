import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    contentType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    metadata: {
        width: Number,
        height: Number,
        alt: String,
        title: String
    }
});

export default mongoose.model('Image', imageSchema);
