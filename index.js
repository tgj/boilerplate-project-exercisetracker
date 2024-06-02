const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { body } = require("express-validator");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

mongoose.connect(process.env.MONGO_URI);

const userController = require("./controllers/user.js");
const exerciseController = require("./controllers/exercise.js");

app.post(
  "/api/users",
  [body("username").notEmpty()],
  userController.user_create_post
);

app.get("/api/users", userController.user_list_get);

app.post("/api/users/:_id/exercises", exerciseController.exercise_create_post);

// Respond not found to all the wrong routes
app.use(function (req, res, next) {
  res.status(404);
  res.type("txt").send("Not found");
});

// Error Middleware
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
