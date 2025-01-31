const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({ message: "No users found!" })
    }
    res.status(200).json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUsers = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;
    // Confirming data
    if (!username || !password || !Array.isArray(roles) || roles.length) {
        return res.status(400).json({ message: "All fields are required" });
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {

})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
    deleteUser, updateUser, createNewUsers, getAllUsers
}