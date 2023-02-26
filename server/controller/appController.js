const User = require("../model/UserSchema");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const otpGenarator = require("otp-generator");

const verify = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    //check the user existance
    let exist = await User.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    res.status(404).send({ error: "Authentication error" });
  }
};

const register = async (req, res, next) => {
  let { email, username, password } = req.body;
  console.log(email, username, password);
  try {
    let hashedPassword = md5(password);
    let data = await User.findOne({ email: email });
    if (data) {
      res.status(400).json({
        message: "User already exist!",
        error: true,
        data: null,
      });
    } else {
      console.log("hashed password---", hashedPassword);
      console.log(email, username, password);
      await User.insertMany({
        email,
        username,
        password: hashedPassword,
      });
      res.status(200).json({
        message: "user Registered Successfully",
        error: false,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let hashedPassword = md5(password);
    let data = await User.findOne({
      username: username,
      password: hashedPassword,
    });
    if (data) {
      let payload = { username, password };
      let token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "5h",
      });
      res.status(200).json({
        error: false,
        message: "Login successful",
        data: { payload, token },
      });
    } else {
      res.status(400).json({
        message: "Invalid email or password",
        error: true,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    let data = await User.findOne({ username: req.params.username });
    if (data) {
      res.status(200).json({
        message: "User Fetched successfully!",
        error: false,
        data: data,
      });
    } else {
      res.status(400).json({
        message: "User not Found!",
        error: true,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    //   console.log("hi");
    //   console.log(req.user);
    let { email, firstName, lastName, mobile, address } = req.body;
    let data = await User.findOne({ _id: req.user._id });
    if (data) {
      const updatedUser = await User.updateOne(
        { _id: req.user._id },
        {
          $set: { email, firstName, lastName, mobile, address },
        }
      );
      res.json({
        message: "User updated successfully",
        error: false,
        data: { email, firstName, lastName, mobile, address },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//install npm i otp-generator
const generateOTP = async (req, res, next) => {
  try {
    // now i want to create here the app locals variables so i can access
    //this otp variable inside verifyOtp controller
    req.app.locals.OTP = await otpGenarator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(201).send({ code: req.app.locals.OTP });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null; //reset otp value
      req.app.locals.resetSession = true; //start session for reset password
      return res.status(201).send({ message: "Verify Successfully!" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//successfully redirect user when OTP is valid
const createResetSession = async (req, res, next) => {
  try {
    if (req.app.locals.resetSession) {
      req.app.locals.resetSession = false; //allow access to this route only once
      return res.status(201).send({ message: "access granted!" });
    }
    return res.status(440).send({ error: "Session expired!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//update the password when we have valid session
const resetPassword = async (req, res, next) => {
  try {
    if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });
    let { username, password } = req.body;
    let hashedPassword = md5(password);
    let result;
    result = await User.findOne({ username: username });
    if (result) {
      await User.updateOne(
        { username: username },
        { password: hashedPassword }
      );
      res.status(201).json({
        message: "Password updated...!",
        error: false,
      });
    } else {
      res.status(500).json({
        message: "Username not found!",
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  verify,
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};
