var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");
var session = require("express-session");
var User = require("./models/user");
var path = require("path");
const flash = require("express-flash-notification");

//pusher configurations
var Pusher = require('pusher');
var pusher = new Pusher({
  appId: '680206',
  key: '73ceba8b748e28aa1869',
  secret: 'ecddc0d6ccaaf06c2ff1',
  cluster: 'ap2',
  //encrypted: true
});

// connect to mongodb
mongoose.connect(
  "mongodb://localhost/test",
  { useNewUrlParser: true, useCreateIndex: true },
  function(req, res) {
    console.log("connected to mongo!!");
  }
);

// start the express server
var app = express();
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("pages", __dirname);
app.set("views", __dirname + "/pages/");

function sendViewMiddleware(req, res, next) {
  res.sendView = function(view, param) {
    var session = req.session.username ? req.session.username : "";
    if (param && param != "") {
      res.render(__dirname + "/pages/" + view + ".html", param);
    } else res.render(__dirname + "/pages/" + view + ".html", session);
  };
  next();
}
// Usage of middlewares
app.use(sendViewMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "SECRETKEY",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash(app));
app.use(express.static(path.join(__dirname, "public")));

function checkSignIn(req, res, next) {
  // check if the user exists
  if (req.session.user) {
    next();
  } else {
    console.log("User is not authenticated");
    res.redirect("/login");
  }
}

// Get requests
app.get("/", function(req, res) {
  res.sendView("login");
});

app.get("/login", function(req, res) {
  req.flash({
        type: 'info',
        message: 'Login page',
        redirect: false
      })
      res.sendView("login");
});

app.get("/logout", function(req, res) {
  // destroy the session
  req.session.destroy(function() {
    console.log("User successfully logged out");
  });
  res.redirect("/login");
});
app.get("/about", checkSignIn, function(req, res) {
  res.sendView("about");
});

app.get("/contact", checkSignIn, function(req, res) {
  res.sendView("contact");
});

app.get("/news", checkSignIn, function(req, res) {
  res.sendView("news");
});

app.get("/home", checkSignIn, function(req, res) {
  res.sendView("home");
});
app.get("/signup", function(req, res) {
  res.sendView("signup");
});

// get all users from db
app.get("/getusers", checkSignIn, function(req, res) {
  User.find().exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      // res.send(doc);
      res.sendView("users_list", { users_list: doc });
    }
  });
});

// user edit
app.get("/user/edit/:userId", checkSignIn, function(req, res) {
  var userId = req.params.userId;
  User.find({ _id: userId }).exec(function(err, doc) {
    if (err) {
      res.redirect("/getusers");
      console.log(err);
    } else {
      // res.send(doc);
      res.sendView("user_edit", { users_list: doc });
    }
  });
});

// delete a document
app.get("/user/delete/:userId", checkSignIn, function(req, res) {
  var userId = req.params.userId;
  User.deleteOne({ _id: userId }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("User deleted successfully");
      res.redirect("/getusers");
    }
  });
});

// POST requests//

// user update
app.post("/user/update", checkSignIn, function(req, res) {
  var userId = req.body.user_id;
  User.findOneAndUpdate(
    { _id: userId },
    {
      name: req.body.name,
      age: req.body.age,
      nationality: req.body.nationality
    },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("User updated successfully");
        res.redirect("/getusers");
      }
    }
  );
});

app.post("/login", function(req, res, next) {
  let stopFlag = false;
  User.find({ username: req.body.username })
    .then(function(user) {
      if (user.length == 0 || typeof user === "undefined") {
        console.log("Username is incorrect");
        req.flash({
          type: 'info',
          message: 'Username is incorrect',
          redirect: false
        })
        stopFlag = true;
        pusher.trigger('my-channel', 'my-event', {
          "message": "Username is incorrect"
        });
       // res.send('')
      // res.redirect('back');
      }
      req.session.user = user;
      req.session.username = { username: req.body.username };
      var userPassword = "";
      user.map(user => {
        userPassword = user.password;
      });
      return bcrypt.compare(req.body.password, userPassword);
    })
    .then(function(samePassword) {
      if (!samePassword && !stopFlag) {
       console.log("Password is incorrect");
       pusher.trigger('my-channel', 'my-event', {
        "message": "Password is incorrect",
        "status": "error",
      });
      res.sendView("login");
      } else if(!stopFlag) {
        console.log("password matched !");
        res.status("200");
        res.sendView("home");
      }
    })
    .catch(function(err) {
      console.log("Error:" + err);
    });
});

app.post("/signup", function(req, res, next) {
  if (req.body.username == "" || req.body.password == "") {
    res.status("400");
    pusher.trigger('my-channel', 'my-event', {
      "message": "Please enter username and password",
      "status": "error",
    });
    //res.send("Please enter username and password");
  } else {
    // check username already exists
    User.find({ username: req.body.username }, function(err, user) {
      if (err) {
        console.log("Signup error");
        return done(err);
      } else {
        if (user.length != 0) {
          console.log("username already exists");
          res.send("username already exists please choose a different one");
        }
      }
    });

    var BCRYPT_SALT_ROUNDS = 12;
    bcrypt
      .hash(req.body.password, BCRYPT_SALT_ROUNDS)
      .then(function(hashedPassword) {
        var newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          name: req.body.name,
          age: req.body.age,
          nationality: req.body.nationality
        });

        // save the user
        newUser.save(function(err, Person) {
          // save the user to a session
          req.session.user = newUser;
          console.log("user registered successfully");
          pusher.trigger('my-channel', 'my-event', {
            "message": "user registered successfully",
            "status": "success",
          });
        });
      })
      .then(function() {
        //res.redirect("/login");
      })
      .catch(function(error) {
        console.log("Error saving user: ");
        console.log(error);
        next();
      });
  }
});
// bind to a port
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log(" app listening at http://%s:%s", host, port);
});
