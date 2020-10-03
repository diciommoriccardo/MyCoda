import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email : {
        type: String,
        unique: true,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

userSchema.pre('update', function () {
    this.updated = Date.now();
});

export default mongoose.model('User', userSchema);
