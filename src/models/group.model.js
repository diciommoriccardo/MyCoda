import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

groupSchema.pre('update', function () {
    this.updated = Date.now();
});

export default mongoose.model('Group', groupSchema);
