const { Exercise, exerciseSchema } = require("../models/exercise");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.exercise_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.json({ error: "invalid request" });
  }

  const { _id, description, duration, date } = req.body;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        const msg = `Error: User with id: ${_id} not found`;
        console.error(msg);
        return res.json({
          error: msg,
        });
      } else {
        console.log(`User with id: ${_id} found`);

        const checkDate = (date) => {
          if (!date) {
            return new Date(Date.now()).toDateString();
          } else {
            const parts = date.split("-");
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);

            const utcDate = new Date(Date.UTC(year, month, day));
            return new Date(
              utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
            ).toDateString();
          }
        };

        const exercise = new Exercise({
          description,
          duration,
          date: checkDate(date),
        });
        user.exercises.push(exercise);

        user
          .save()
          .then((_) => {
            res.json({
              _id: _id,
              username: user.username,
              description,
              duration,
              date: exercise.date,
            });
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

exports.exercise_logs_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED");
});
