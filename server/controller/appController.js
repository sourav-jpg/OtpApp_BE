const User = require("../model/UserSchema");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

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
  
    let { email, firstName, lastName, mobile, address } = req.body;
    let data = await User.findOne({ _id: req.user._id});

    if (data) {
      const updatedUser = await User.updateOne(
        { _id: req.user._id }, 
        {
            $set : {email, firstName, lastName, mobile, address}
        }  
        
        );
      res.json({
        message: "User updated successfully",
        error: false,
        data: updatedUser,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const generateOTP = async () => {
  try {
  } catch (error) {}
};

const verifyOTP = async () => {
  try {
  } catch (error) {}
};

const createResetSession = async () => {
  try {
  } catch (error) {}
};

const resetPassword = async () => {
  try {
  } catch (error) {}
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};
