const bookSchema = require("../validators/bookValidator")

const bookValidator = (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Cover image is required"
        })
    }

    const { error } = bookSchema.validate({ ...req.body, coverImageURL: req.file.path })

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        })
    }
    next()

}
module.exports = bookValidator;