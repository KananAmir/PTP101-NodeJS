const multer = require('multer')

const errorHandling = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: "Multer error",
            error: err.message
        })
    }

    if (err) {
        
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

    next()
}


module.exports = errorHandling