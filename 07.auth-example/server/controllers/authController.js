const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


require('dotenv').config()


const register = async (req, res) => {
    try {
        const { username, password, email } = req.body

        const existingUser = await UserModel.findOne({ email: email })

        console.log(existingUser);

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // console.log('hashed password', hashedPassword);

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email
        })

        await newUser.save()

        res.status(201).json({
            message: `User ${username} registered successfully`,
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
        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email! or password'
            })
        }


        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email! or password'
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


module.exports = {
    register,
    login
}


