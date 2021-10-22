module.exports = function (app, passport) {
  app.get("/login", function (req, res) {
    res.render("./login", {
      title: "EMP Auth + Roles",
      heading: "Sign In",
    });
  });

  // Login
  // As admin
  app.post(
    "/admin-login",
    passport.authenticate("local-login", {
      //   successRedirect: "/admin", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the login page if there is an err
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      var user = req.user;
      console.log(
        `User ${user.user_id} (${user.username}:${user.role}) logged in!`
      );

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3 * 12;
      } else {
        req.session.cookie.expires = false;
      }

      // if user is logged in
      res.redirect("/admin/" + user.user_id);
    }
  );

  app.all("/admin/*", requireRole("admin"));
  app.use("/admin", isLoggedIn, require("./admin"));

  // As user
  app.post(
    "/user-login",
    passport.authenticate("local-login", {
      //   successRedirect: "/users", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the login page if there is an err
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      var user = req.user;
      console.log(
        `User ${user.user_id} (${user.username}:${user.role}) logged in!`
      );

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3 * 12;
      } else {
        req.session.cookie.expires = false;
      }

      // if user is logged in
      res.redirect("/users/" + user.user_id);
    }
  );

  app.all("/users/*", requireRole("user"));
  app.use("/users", isLoggedIn, require("./users"));

  // middleware for route access
  function requireRole(role) {
    return function (req, res, next) {
      if (req.user && req.user.role == role) {
        next();
      } else {
        res.redirect("/login");
        console.log(req.user, "Invalid user role");
      }
    };
  }

  // route middleware to make sure
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    } else {
      // if they aren't redirect them to the home page
      res.redirect("/login");
      console.log("User is not authenticated");
    }
  }

  // Logout
  app.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
      res.redirect("/login");
      console.log("User logged out!");
    });
  });
};
