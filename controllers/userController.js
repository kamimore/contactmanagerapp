const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("all fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = User.create({
    username,
    email,
    password: hashPassword,
  });

  if (user) {
    res.status(201).json({
      message: "User registered successfully",
      id: user.id,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("user data is not valid");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "1d" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(404);
    throw new Error("No user found");
  }
  res.json({ message: "Login the user" });
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200);
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
