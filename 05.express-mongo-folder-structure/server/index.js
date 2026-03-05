const express = require('express')
const cors = require('cors')
const connectDB = require('./config')
const bookRoute = require('./routes/bookRoute')
const genreRoute = require('./routes/genreRoute')
const rateLimit = require("express-rate-limit");

require('dotenv').config()

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


// middleware

// logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next()
}

// global error handler
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message:  err.message, success: false });
}

 
app.use(cors(corsOptions))

app.use(apiLimiter) // global API limiter
app.use(logger) // global middleware

app.use("/auth/login", loginLimiter);

app.post("/auth/login", (req, res) => {
  res.send("Login attempt");
});

app.use(express.json()) // for parsing application/json

 
app.use('/api/books', bookRoute) // book route
app.use('/api/genres', genreRoute) // genre route


app.listen(port, () => {
    console.log(`Example app listening on port ${port}, link: http://localhost:8080/`)
})

connectDB()