const Exercise = require("../models/exercise");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.exercise_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED");
});

exports.exercise_logs_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED");
});
