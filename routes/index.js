module.exports = function (app, passport) {
  app.get("/", function (req, res) {
    res.render("index", {
      title: "EMP Auth + Roles",
      heading: "Home",
      message: req.flash("success", "Welcome"),
    });
  });

  require("./register")(app, passport);

  require("./login")(app, passport);
};
