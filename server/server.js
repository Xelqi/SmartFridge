require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const openaiRoute = require("./routes/openAi");
const userRoute = require("./routes/userRoutes")
const mongoose = require("mongoose");
const { error } = require("console");

// Express App
const app = express();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Port app running on
const PORT = process.env.PORT;

// Run build command then drag into folder to use its static files
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json()); // For using JSON
app.use(cors(
  {
    origin: ['http://localhost:3000'],
    credentials: true,
  }
)); // Enable CORS for all routes

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log("Connected to MongoDB \nStarting Server on PORT: " + PORT));
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api", openaiRoute);
app.use("/api/user", userRoute);