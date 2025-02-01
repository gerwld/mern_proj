const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
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
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec();
    if(duplicate) {
        return res.status(401).json({message: "Duplicate username"});
    }
    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
   
    const userObject = {username, password: hashedPwd, roles}

    // Create and store new user
    const user = await User.create(userObject);
    if(user) { // Created
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: "Invaid user data recieved"})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body
    
    
    //Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {        
        return res.status(400).json({message: "All fields are required"})
    }

    // Check if exist
    const user = await User.findById(id).exec();
    if(!user) {
        console.log(user);
        return res.status(400).json({message: "User not found"})
    }

    // Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec();
    // Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(401).json({message: "Duplicate username"})
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password) {
        // Hashing the pwd
        user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(400).json({message: "User ID required"});
    }

    // Check if assigned notes for userID exist
    const note = await Note.findOne({user: id}).lean().exec();
    if(note) {
        return res.status(400).json({message: "User has assigned notes"});
    }


    const user = await User.findById(id).exec();

    if(!user) {
        return res.status(400).json({message: "User not found"})
    }

    const result = await User.findOneAndDelete({ _id: user._id });
    const reply = `Username ${result.username} with id ${result.id} deleted`
    res.json(reply)
})

module.exports = {
    deleteUser, updateUser, createNewUsers, getAllUsers
}