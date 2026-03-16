
// book validator middleware
// const bookValidator = (req, res, next) => {

//     console.log('Book validator middleware called');
//     console.log(req.body);

//     const { title, description, price, author, stock, genre, language } = req.body
//     if (!title || !description || !price || !author || !stock || !genre || !language) {
//         return res.status(400).json({
//             message: 'All fields are required',
//             success: false
//         })
//     }

//     if(!req.file){
//         return res.status(400).json({
//             message: 'Cover image is required',
//             success: false
//         })
//     }


//     next()
// }


// module.exports = bookValidator


const Joi = require("joi");

const bookSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required(),

    description: Joi.string()
        .min(5)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    author: Joi.string()
        .min(2)
        .required(),

    stock: Joi.number()
        .min(0)
        .default(0),

    genre: Joi.string()
        .required(),

    language: Joi.string()
        .required(),

    rating: Joi.number()
        .min(0)
        .max(5)
        .default(0),

    sold: Joi.number()
        .min(0)
        .default(0),

    discount: Joi.number()
        .min(0)
        .default(0),

    coverImageURL: Joi.string().uri().required(),

});

module.exports = bookSchema;

