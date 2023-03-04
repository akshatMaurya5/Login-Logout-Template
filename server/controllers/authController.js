const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    // res.send("this is for signup")

    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(404).send("All fields are required.");
        return res.send(error(404, "All fields are required."));
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      // return res.status(409).send("Email already registered.")
      return res.send(error(409, "Email already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // return res.status(201).json({
    //   user,
    // });

    res.send(success(201, {
        user
    }))


  } catch (e) {
    console.log(e);
  }
};

const loginController = async (req, res) => {
  try {
    //   res.send("this is for login")

    const { email, password } = req.body;

    if (!email || !password) {
      // res.status(400).send("Bad credentials");
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      // return res.status(404).send("User not registered.");
      return res.send(error(404, "User not registered."));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(404, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({ _id: user._id });

    const refreshToken = generateRefreshAccessToken({ _id: user._id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.json({accessToken, refreshToken});
    // return res.json({ accessToken });

    return res.send(success(200, {accessToken}))

  } catch (e) {
    console.log(e);
  }
};

//for jwt
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "15min",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

//this will check the refreshToken validity and generate new access token
const refreshAccessTokenController = async (req, res) => {
  // const {refreshToken} = req.body;

  const cookies = req.cookies;

  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookie is required");
    return res.send(error(401,"Refresh token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  // if(!refreshToken){
  //    return res.status(401).send("Refresh token not found");

  // }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    const _id = decoded._id;

    const newAccessToken = generateAccessToken({ _id });

    // return res.status(201).json({ newAccessToken });
    return res.send(success(201, {newaccessToken: newAccessToken}))
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid Refresh token.");
        return res.send(error(401, "Invalid Refresh token."));

  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
};
