const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide unique Username"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide unique password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide unique email"],
    unique: false,
  },
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 12,
  },
  lastName: {
    type: String,
    minLength: 1,
    maxLength: 10,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
