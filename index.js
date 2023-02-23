const express = require("express");
const path = require("path");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "https://silver-pony-75526a.netlify.app",
    "https://singular-caramel-788253.netlify.app",
  ],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

app.use(function (req, res, next) {
  res.sendStatus(404);
});

app.listen(process.env.PORT || 80, () => console.log("Listening on port 3000"));
