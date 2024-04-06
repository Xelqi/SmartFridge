// controller/authController.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Getting the token from the header for JWT
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(' ')[1]
  // Cookie Token
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  // console.log("Token:", token); // Log the token value
  if (!token && !refreshToken) {
    // res.clearCookie("token");
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Verify token see if its valid or not
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // console.log({ RefreshTokeninErrorAUth: req.cookies.refreshToken });
      refreshTokenMiddleWare(req, res, next);
      // return res.status(403).json({ error: "Forbidden" });
    } else {
      // set our user to the request when token valid
      // Identifier
      req.user = user;
      next();
    }
  });
}

function refreshTokenMiddleWare(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  // console.log({ refreshToken: refreshToken });
  if (refreshToken) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          //Handle invalid refresh token or expired
          return res
            .status(401)
            .json({ error: "Inalid or Expired Token Please Log in Again" })
            .redirect("/login");
        } else {
          if (decoded && decoded.username) {
            // console.log({ decoded: decoded });
            // console.log(decoded.username);
            // Generate a new JWT token
            const newToken = jwt.sign(
              { username: decoded.username,
                _id: decoded._id, },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );
            res.clearCookie("token");
            res.cookie("token", newToken);
            // res.status(200).json({ jwtToken: newToken });
            console.log("new token generated");
            // Authenticate the new token to set req.user
            // Set req.user and proceed to the next middleware
            req.user = decoded;
            // console.log("User Refreshtoken:", decoded);
            next();
          }
        }
      }
    );
  } else {
    return res.status(401).json({ error: "Refresh token not provided" });
  }
}

async function generateNewToken(user, res) {
  try {
    console.log(user.username)
    const accessToken = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Set access token expiration to 1 hour
    );

    const refreshToken = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Set refresh token expiration to 7 days
    );

    // Set expiration time for cookies
    const accessTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Clear the existing tokens cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    // Set the new tokens in cookies
    res.cookie("token", accessToken, { expires: accessTokenExpiration, httpOnly: true });
    res.cookie("refreshToken", refreshToken, { expires: refreshTokenExpiration, httpOnly: true });

    return { accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration };
  } catch (error) {
    console.log(error);
  }
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Initialize the user with default storage and shopping list
    const user = new User({
      username,
      email,
      password,
      storage: [
        {
          storage_name: "Fridge",
          items: [
            {
              item_name: "milk",
              category: "dairy",
              expiryDays: 14,
              quantity: 1,
            }
          ],
        },
      ], // Default storage
      shopping_lists: [
        {
          list_name: "Food Shop",
          items: [{ item_name: "milk", quantity: 1, checked: true },{ item_name: "chocolate", quantity: 1, checked: false }],
        }
      ], // Default shopping list
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register };

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { username: user.username,
        _id: user._id, },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { username: user.username,
        _id: user._id, },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set expiration time for cookies
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 5 minutes
    const refreshTokenExpiration = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days

    res.cookie("token", token, { expires: tokenExpiration });
    res.cookie("refreshToken", refreshToken, {
      expires: refreshTokenExpiration,
    });

    res.status(200).json({ message: "Login successful", user }); // Sending JSON response
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}



// controller/authController.js
function logout(req, res) {
  try {
    // Clear both the token and refreshToken cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({ Success: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging out" });
  }
}

// bycrpyt.compare(password, user.password,) (err, response) => { if(response) { res.json("Success")} else {res.json("Invalid Password")}}
module.exports = { register, login, logout, authenticateToken, generateNewToken };
