
// @desc Login
// @route POST /auth
// @acesss Public
const login = (req, res) => {

}


// @desc Refresh
// @route GET /auth/refresh
// @acess Public - because access token has expired
const refresh = (req, res) => {

}



// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {

}


module.exports =  {
    login, 
    refresh,
    logout
}