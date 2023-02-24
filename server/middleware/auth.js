//auth middleware
const jwt = require("jsonwebtoken");

const User = require("../model/UserSchema");

const Auth = async (req, res, next) => {
  try {
    //access authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];

    //retrive the user details of the logged in user
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ username: decodedToken.username });
    res.user = user;
 
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = Auth 
