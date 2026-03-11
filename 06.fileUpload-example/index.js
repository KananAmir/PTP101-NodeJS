const express = require('express')
const cors = require('cors')
const connectDB = require('./config')
const bookRoute = require('./routes/bookRoute')
const genreRoute = require('./routes/genreRoute')
const rateLimit = require("express-rate-limit");
const logger = require('./middlewares/logger')
require('dotenv').config()
const path = require('path')
const multer = require('multer')



const app = express()
const port = process.env.PORT || 8080

const corsOptions = {
  origin: ['http://localhost:5173'],
  optionsSuccessStatus: 200
}


// Login endpoint üçün limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dəqiqə
  max: 5,                    // Maksimum 5 sorğu
  message: "Çox sayda cəhd etdiniz. 15 dəqiqə sonra yenidən yoxlayın."
});

// global API limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dəqiqə
  max: 10                  // Hər IP 1 dəqiqədə 100 request edə bilər
});


app.use(cors(corsOptions))

app.use(apiLimiter) // global API limiter
app.use(logger) // global middleware

app.use(express.json()) // for parsing application/json


// app.use(express.static("uploads")) // for serving static files from uploads folder
// app.use('/static', express.static('uploads')) // for serving static files from uploads folder with /static prefix

app.use('/static', express.static(path.join(__dirname, 'uploads'))) // for serving static files from uploads folder with /static prefix




// multer usage

// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})


// 1MB = 1024 KB
// 1KB = 1024 bytes


app.post('/api/imageUpload', upload.single('imageUrl'), (req, res, next) => {
  try {
    console.log('file', req.file);
    res.status(200).json({
      message: 'Image uploaded successfully',
      success: true,
      error: null,
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error uploading image',
      success: false,
      error: error.message,
    })
  }
})

app.use((err, req, res, next) => {

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
})
app.use('/api/books', bookRoute) // book route
app.use('/api/genres', genreRoute) // genre route


app.listen(port, () => {
  console.log(`Example app listening on port ${port}, link: http://localhost:8080/`)
})

connectDB()