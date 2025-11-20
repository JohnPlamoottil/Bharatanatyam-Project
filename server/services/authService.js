const User = require("../models/User");

async function createUser(username, email, password, role = "user") {
  const user = new User({
    username,
    email,
    password,
    role,
  });

  await user.save();
  return user;
}

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function findUserByUsername(username) {
  return await User.findOne({ username });
}

async function findUserById(userId) {
  return await User.findById(userId).select("-password");
}

async function getAllUsers() {
  return await User.find({}).select("-password");
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  getAllUsers,
};
