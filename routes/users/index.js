var router = require("express").Router();
const connection = require("../../config/database");
var bcrypt = require("bcrypt");

// Dashboard
router.get("/:userId", function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;

    res.render("./users/users/index", {
      title: "EMP Auth + Roles",
      heading: "Dashboard",
      user: req.user,
      data: rows,
    });
  });
});

// Profile
router.get("/:userId/profile", function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;

    res.render("./users/users/profile", {
      title: "EMP Auth + Roles",
      heading: "Profile",
      user: req.user,
      data: rows,
    });
  });
});

router.post("/:userId/profile", function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;

    var User = {
      name: req.body.name,
      username: req.body.username,
      role: "user",
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      created: new Date(),
    };

    var user = rows[0];

    // hash password
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return done(err);

      if (User.password > 0) {
        User.password = hash;
      } else {
        User.password = user.password;
      }
      console.log(User);

      var sql = "UPDATE users SET ? WHERE user_id = ?";
      connection.query(sql, [User, uId], function (err, rows) {
        if (err) throw err;

        console.log(`Profile updated`);
        res.redirect("back");
      });
    });
  });
});

module.exports = router;
