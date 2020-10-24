require("dotenv").config();
require("./configs/passport");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const logger = require("morgan");
const passport = require("passport");
const path = require("path");
const session = require("express-session");
const uploadCloud = require("./configs/cloudinary");

const app_name = require("./package.json").name;
const authRoutes = require("./routes/auth");
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);
const MongoStore = require("connect-mongo")(session);

const app = express();

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo [Atlas]! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

mongoose.set("useFindAndModify", false); //j get rid of depracation warning for findByIdAndUpdate

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// USE passport.initialize() and passport.session() HERE:
app.use(passport.initialize());
app.use(passport.session());

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/client/build")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

app.use("/api/items", require("./routes/items"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/user", require("./routes/user"));

app.use((req, res) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/client/build/index.html");
});

module.exports = app;
