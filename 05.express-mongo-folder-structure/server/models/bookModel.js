const mongoose = require('mongoose');

// book schema
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        author: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        genre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre',
            required: true
        },
        language: {
            type: String,
            required: true
        },
        coverImageURL: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        sold: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true, versionKey: false }
);
``
const BookModel = mongoose.model('Book', bookSchema)

module.exports = BookModel