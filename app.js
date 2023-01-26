const express = require("express");
const path = require("path");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// const User = require("./models/User")

// init dotenv
dotenv.config();

const app = express();

// Connect to DB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routes

const apiRouter = require("./routes/index");

// express setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

app.use(function (req, res, next) {
  res.sendStatus(404);
});

app.listen(3000, () => console.log("Listening on port 3000"));
