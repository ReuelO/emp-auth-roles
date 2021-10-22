var router = require("express").Router();
var connection = require("../../config/database");

router.get("/", function (req, res) {
  var sql = "SELECT * FROM users";
  connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.render("./users/admin/users", {
      title: "EMP Auth + Roles",
      user: req.user,
      heading: "Users",
      page: "Users",
      data: rows,
    });
  });
});

router.get("/add", function (req, res) {
  var sql = "SELECT * FROM users";
  connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.render("./users/admin/users/add", {
      title: "EMP Auth + Roles",
      heading: "Users",
      page: "Add User",
      user: req.user,
      data: rows,
    });
  });
});

router.post("/add", function (req, res) {
  var post = req.body;
  var User = {
    name: post.name,
    username: post.username,
    role: "user",
    email: post.email,
    phone: post.phone,
    created: new Date(),
  };

  console.log(User);
  var sql = "SELECT * FROM users WHERE username = ? AND role = ?";
  connection.query(sql, [User.username, User.role], function (err, rows) {
    if (err) throw err;
    if (rows.length > 0) {
      console.log("User already exists");
      req.flash("error", "User already exists");
      res.redirect("back");
    } else {
      var sql = "INSERT INTO users SET ?";
      connection.query(sql, [User], function (err, rows) {
        if (err) throw err;
        console.log("New User added: ", rows);
        req.flash("success", "New user added");
        res.redirect("../users");
      });
    }
  });
});

router.get("/:userId", function (req, res) {
  var uId = req.params.userId;
  var sql = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;
    res.render("./users/admin/users/edit", {
      title: "EMP Auth + Roles",
      heading: "Users",
      page: "User Details",
      user: req.user,
      data: rows,
    });
  });
});

router.post("/edit/:userId", function (req, res) {
  var uId = req.params.userId;
  var post = req.body;
  var User = {
    name: post.name,
    username: post.username,
    role: "user",
    email: post.email,
    phone: post.phone,
  };

  console.log(User);
  var sql = "UPDATE users SET ? WHERE user_id = ?";
  connection.query(sql, [User, uId], function (err, rows) {
    if (err) throw err;
    console.log("User " + uId + " updated");
    res.redirect("..");
  });
});

router.post("/delete/:userId", function (req, res) {
  var uId = req.params.userId;
  var sql = "DELETE FROM users WHERE user_id = ?";
  connection.query(sql, [uId], function (err, rows) {
    if (err) throw err;
    console.log("User " + uId + " deleted");
    res.redirect("..");
  });
});

module.exports = router;
