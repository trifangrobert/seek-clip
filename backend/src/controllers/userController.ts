
const dotenv = require('dotenv');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

dotenv.config();

const createToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}

const registerUser = async (req: any, res: any) => {
    const {email, password} = req.body;
    try {
        const user = await User.register(email, password);
        console.log("this is the user:", user);
        const token = createToken(user._id);
        res.status(201).json({ user: user._id, token });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req: any, res: any) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        console.log("this is the user:", user);
        const token = createToken(user._id);
        res.status(200).json({ user: user._id, token });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { registerUser, loginUser };