var router = require("express").Router();
const connection = require("../../config/database");
var bcrypt = require("bcrypt");

function users(req, res, next) {
  var sql = "SELECT COUNT(*) AS count FROM users";
  connection.query(sql, function (err, rows) {
    if (err) throw err;
    count = rows[0].count;
    req.users = rows;
    return next();
  });
}

// Dashboard
router.get("/:userId", users, function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;

    res.render("./users/admin/index", {
      title: "EMP Auth + Roles",
      heading: "Dashboard",
      user: req.user,
      data: rows,
      users: req.users,
    });
  });
});

// Profile
router.get("/:userId/profile", function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;

    res.render("./users/admin/profile", {
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

    var user = rows[0];

    var User = {
      name: req.body.name,
      username: req.body.username,
      role: "admin",
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      created: new Date(),
    };

    // hash password
    bcrypt.hash(User.password, 10, function (err, hash) {
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

// admin functions
router.use("/:userId/users", require("./users"));

module.exports = router;
