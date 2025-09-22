const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");

const emailRegex = /^(?=.{1,40}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^(?=.{1,40}$)[A-Za-z ]+$/;
const passwordLength = 30;

const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
  }


const register = async (req, res) => {
  //Validate message to ensure that all parameters are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  //Validate that the email is compliant and name is limited to 40 characters. PW Will be limited to 30 chars.
  if (!emailRegex.test(req.body.email) || !nameRegex.test(req.body.name || req.body.password.length() > passwordLength )){
    return res.status(400).json({ message: "Please check your request: name is limited to 40 characters, password is limited to 30 characters, and must be a valid email."})
  }

  const cleanEmail = normalizeEmail(req.body.email);

  const exists = await User.exists({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ message: "Email is already in use." });
    }

  const user = new User({
    name: req.body.name,
    email: cleanEmail,
    password: "",
  });
  user.setPassword(req.body.password);
  const q = await user.save();

  if (!q) {
    //database returned no data
    return res.status(400).json(err);
  } else {
    //Return new user token
    const token = user.generateJWT();
    return res.status(200).json(token);
  }
};

const login = (req, res) => {
  // Validate message to ensure that email and password are present.
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  // Delegate authentication to passport module
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Error in Authentication Process
      return res.status(404).json(err);
    }
    if (user) {
      // Auth succeeded - generate JWT and return to caller
      const token = user.generateJWT();
      res.status(200).json({ token });
    } else {
      // Auth failed return error
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports = {
  register,
  login,
};
