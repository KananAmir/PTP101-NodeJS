
// book validator middleware
const bookValidator = (req, res, next) => {

    console.log('Book validator middleware called');
    console.log(req.body);
    
    const { title, description, price, author, stock, genre, language } = req.body
    if (!title || !description || !price || !author || !stock || !genre || !language) {
        return res.status(400).json({
            message: 'All fields are required',
            success: false
        })
    }

    if(!req.file){
        return res.status(400).json({
            message: 'Cover image is required',
            success: false
        })
    }


    next()
}


module.exports = bookValidator