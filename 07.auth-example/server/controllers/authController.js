const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt');

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
            message: 'User registered successfully',
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
const login = (req, res) => {

}


module.exports = {
    register,
    login
}