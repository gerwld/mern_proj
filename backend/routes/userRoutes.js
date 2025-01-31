const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userControllers");

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUsers)
    .patch(usersController.createNewUsers)
    .delete(usersController.deleteUser)



module.exports = router;