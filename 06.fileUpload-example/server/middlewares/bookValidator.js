
// book validator middleware
const bookValidator = (req, res, next) => {

    const { title, description, price, author, stock, genre, language, coverImageURL } = req.body
    if (!title || !description || !price || !author || !stock || !genre || !language || !coverImageURL) {
        return res.status(400).json({
            message: 'All fields are required',
            success: false
        })
    }

    next()
}


module.exports = bookValidator