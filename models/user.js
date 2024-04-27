// import mongoose
const mongoose = require("mongoose");

// define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Specify collection name
const collectionName = 'users';

module.exports = mongoose.model("User", userSchema, collectionName);
