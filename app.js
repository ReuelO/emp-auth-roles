var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "emp_auth_roles",
};

var sessionStore = new MySQLStore(options);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    key: "user_session",
    secret: "user_token",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  })
);

// passport handler
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// flash messages
app.use(flash());

// local messages
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// route handler
require("./routes")(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
