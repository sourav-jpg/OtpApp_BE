const express = require("express");
const route = express.Router();
const controller = require("../controller/appController");
const auth  = require("../middleware/auth");

// POST Methods
route.post("/login", controller.login); //login in app
route.post("/register", controller.register); //register user
// route.post('/registerMail',controller.register);//send the email
// route.post('/authenticate',controller.register);//authenticate the user

//GET Methods
route.get("/user/:username", controller.getUser); //user with username
route.get("/generateOTP", controller.generateOTP); //generate random OTP
route.get("/verifyOTP", controller.verifyOTP); //verify generated OTP
route.get("/createResetSession", controller.createResetSession); //reset all variables

//PUT Methods
route.put("/updateuser", controller.updateUser,auth); // is used to update the user profile
route.put("/resetPassword", controller.resetPassword); // used to reset password

module.exports = route;
