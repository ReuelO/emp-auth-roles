var LocalStrategy = require("passport-local-roles").Strategy;
var bcrypt = require("bcrypt");
var connection = require("./database");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // Register
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        roleField: "role",
        passReqToCallback: true,
      },
      function (req, username, password, role, done) {
        var sql = "SELECT * FROM users WHERE username = ? AND role = ?";
        connection.query(sql, [username, role], function (err, rows) {
          if (err) return done(err);

          // if username exists
          if (rows.length) {
            console.log(`User "${username}:${role}" already exists!`);

            return done(
              null,
              false,
              req.flash("error", `User "${username}:${role}" already exists!`)
            );
          } else {
            // register user
            var User = {
              username: username,
              role: role,
              password: password,
              created: new Date(),
            };

            // hash password
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) return done(err);

              User.password = hash;
              var sql = "INSERT INTO users SET ?";
              connection.query(sql, [User], function (err, rows) {
                if (err) return done(err);

                User.user_id = rows.insertId;
                console.log(
                  `User ${User.user_id} (${username}:${role}) registered!`
                );

                return done(
                  null,
                  User,
                  req.flash("success", `User successfully registered!`)
                );
              });
            });
          }
        });
      }
    )
  );

  // Login
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        roleField: "role",
        passReqToCallback: true,
      },
      (req, username, password, role, done) => {
        var sql = "SELECT * FROM users WHERE username = ? AND role = ?";
        connection.query(sql, [username, role], (err, rows) => {
          if (err) return done(err);

          var user = rows[0];

          // if user not found
          if (rows.length == 0) {
            console.log(`User "${username}:${role}" not found`);
            return done(
              null,
              false,
              req.flash("error", `User "${username}:${role}" not found`)
            );
          } else {
            // if username is valid
            var hash = user.password;
            bcrypt.compare(password, hash, function (err, result) {
              if (err) return done(err);
              console.log(result);

              if (!result) {
                console.log(`Invalid password`);
                return done(
                  null,
                  false,
                  req.flash("error", `Invalid password`)
                );
              } else {
                return done(
                  null,
                  user,
                  req.flash("success", `Welcome, ${username}!`)
                );
              }
            });
          }
        });
      }
    )
  );
};
