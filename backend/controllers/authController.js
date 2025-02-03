const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


// @desc Login
// @route POST /auth
// @acesss Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser || !foundUser.active) {
        return res.status(400).json({ message: "Unauthorized 2" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(400).json({ message: "Unauthorized" })

    res.status(200).json({message: "Authorized"});
});


// @desc Refresh
// @route GET /auth/refresh
// @acess Public - because access token has expired
const refresh = async (req, res) => {

}



// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = async (req, res) => {

}


module.exports = {
    login,
    refresh,
    logout
}