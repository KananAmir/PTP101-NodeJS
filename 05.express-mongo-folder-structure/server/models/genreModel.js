const mongoose = require('mongoose');

// genre schema
const genreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true, versionKey: false }
);
``
const GenreModel = mongoose.model('Genre', genreSchema)

module.exports = GenreModel