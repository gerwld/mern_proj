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
    if (!match) return res.status(401).json({ message: "Unauthorized" })

    // res.status(200).json({message: "Authorized"});

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1m'}
    );
    const refreshToken = jwt.sign(
        { "username": foundUser.username }, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server
        secure: true, // https
        sameSite: 'None', // dev, cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry (7d), better to >1d
    })

    // Send accessToken containing username and roles
    res.json({accessToken})
});


// @desc Refresh
// @route GET /auth/refresh
// @acess Public - because access token has expired
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).jsoh({message: "Unauthorized"});

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
            if(err) return res.status(403).json({message: "Forbidden"})

            const foundUser = await User.findOne({username: decoded.username})

            if(!foundUser) return res.status(401).json({message: "Unauthorized"});

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "1m"}

            );

            res.json({accessToken});
        })
    )
}



// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies.jwt) return res.sendStatus(204) // No content
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.json({message: "Cookie cleared"})
}


module.exports = {
    login,
    refresh,
    logout
}