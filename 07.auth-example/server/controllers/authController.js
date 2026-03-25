const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendEmail')
const crypto = require('crypto')

require('dotenv').config()


const register = async (req, res) => {
    try {
        const { username, password, email } = req.body

        if (!username || !password || !email) {
            return res.status(400).json({
                message: 'Username, password and email are required'
            })
        }

        const existingUser = await UserModel.findOne({ email: email })

        console.log(existingUser);

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // console.log('hashed password', hashedPassword);


        const verificationToken = crypto.randomBytes(32).toString('hex')

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            verificationToken
        })

        console.log('verivication token', verificationToken);
        

        await newUser.save()

        await sendVerificationEmail(email, newUser.verificationToken)

        res.status(201).json({
            message: `User ${username} registered successfully, please check your email to verify your account`,
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body

        if (!emailOrUsername || !password) {
            return res.status(400).json({
                message: 'Email/Username and password are required'
            })
        }

        const user = await UserModel.findOne({ email: emailOrUsername }) || await UserModel.findOne({ username: emailOrUsername })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email/username or password'
            })
        }


        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email/username or password'
            })
        }


        // const token = jwt.sign({
        //     id: user._id,
        //     email: user.email,
        //     role: user.role
        // }, process.env.JWT_SECRET, { expiresIn: 60 * 60 } ) // 1 hour


        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' }) // 1 hour


        res.status(200).json({
            message: `User logged in successfully`,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const verifyUser = async (req, res) => {
    try {
        const { token } = req.params

        const user = await UserModel.findOne({ verificationToken: token })

        console.log('user', user);
        
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired token'
            })
        }

        user.isVerified = true
        user.verificationToken = null

        await user.save()

        res.status(200).json({
            message: 'Account verified successfully'
        })
        
        // res.status(200).redirect('http://localhost:5173/login')

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    register,
    login,
    verifyUser
}


