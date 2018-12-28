/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nvar bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n\nvar personSchema = mongoose.Schema({\n  username: {\n    type: String,\n    unique: true\n  },\n  password: String,\n  name: String,\n  age: Number,\n  nationality: String\n});\n\npersonSchema.methods.comparePassword = function (candidatePassword, cb) {\n  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {\n    if (err) return cb(err);\n    cb(null, isMatch);\n  });\n};\n\nmodule.exports = mongoose.model(\"User\", personSchema);\n\n//# sourceURL=webpack:///./models/user.js?");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nvar bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n\nvar session = __webpack_require__(/*! express-session */ \"express-session\");\n\nvar User = __webpack_require__(/*! ./models/user */ \"./models/user.js\");\n\nvar path = __webpack_require__(/*! path */ \"path\");\n\nconst flash = __webpack_require__(/*! express-flash-notification */ \"express-flash-notification\"); //pusher configurations\n\n\nvar Pusher = __webpack_require__(/*! pusher */ \"pusher\");\n\nvar pusher = new Pusher({\n  appId: \"680206\",\n  key: \"73ceba8b748e28aa1869\",\n  secret: \"ecddc0d6ccaaf06c2ff1\",\n  cluster: \"ap2\" //encrypted: true\n\n}); // connect to mongodb\n\nmongoose.connect(\"mongodb://localhost/test\", {\n  useNewUrlParser: true,\n  useCreateIndex: true\n}, function (req, res) {\n  console.log(\"connected to mongo!!\");\n}); // start the express server\n\nvar app = express();\napp.engine(\"html\", __webpack_require__(/*! ejs */ \"ejs\").renderFile);\napp.set(\"view engine\", \"html\");\napp.set(\"pages\", __dirname);\napp.set(\"views\", __dirname + \"/pages/\");\n\nfunction sendViewMiddleware(req, res, next) {\n  res.sendView = function (view, param) {\n    var session = req.session.username ? req.session.username : \"\";\n\n    if (param && param != \"\") {\n      res.render(__dirname + \"/pages/\" + view + \".html\", param);\n    } else res.render(__dirname + \"/pages/\" + view + \".html\", session);\n  };\n\n  next();\n} // Usage of middlewares\n\n\napp.use(sendViewMiddleware);\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({\n  extended: true\n}));\napp.use(session({\n  secret: \"SECRETKEY\",\n  resave: true,\n  saveUninitialized: true\n}));\napp.use(flash(app));\napp.use(express.static(path.join(__dirname, \"public\")));\n\nfunction checkSignIn(req, res, next) {\n  // check if the user exists\n  if (req.session.user) {\n    next();\n  } else {\n    console.log(\"User is not authenticated\");\n    res.redirect(\"/login\");\n  }\n} // Get requests\n\n\napp.get(\"/\", function (req, res) {\n  res.sendView(\"login\");\n});\napp.get(\"/login\", function (req, res) {\n  req.flash({\n    type: \"info\",\n    message: \"Login page\",\n    redirect: false\n  });\n  res.sendView(\"login\");\n});\napp.get(\"/logout\", function (req, res) {\n  // destroy the session\n  req.session.destroy(function () {\n    console.log(\"User successfully logged out\");\n  });\n  res.redirect(\"/login\");\n});\napp.get(\"/about\", checkSignIn, function (req, res) {\n  res.sendView(\"about\");\n});\napp.get(\"/contact\", checkSignIn, function (req, res) {\n  res.sendView(\"contact\");\n});\napp.get(\"/news\", checkSignIn, function (req, res) {\n  res.sendView(\"news\");\n});\napp.get(\"/home\", checkSignIn, function (req, res) {\n  res.sendView(\"home\");\n});\napp.get(\"/signup\", function (req, res) {\n  res.sendView(\"signup\");\n}); // get all users from db\n\napp.get(\"/getusers\", checkSignIn, function (req, res) {\n  User.find().exec(function (err, doc) {\n    if (err) {\n      console.log(err);\n    } else {\n      // res.send(doc);\n      res.sendView(\"users_list\", {\n        users_list: doc\n      });\n    }\n  });\n}); // user edit\n\napp.get(\"/user/edit/:userId\", checkSignIn, function (req, res) {\n  var userId = req.params.userId;\n  User.find({\n    _id: userId\n  }).exec(function (err, doc) {\n    if (err) {\n      res.redirect(\"/getusers\");\n      console.log(err);\n    } else {\n      res.sendView(\"user_edit\", {\n        users_list: doc\n      });\n    }\n  });\n}); // delete a document\n\napp.get(\"/user/delete/:userId\", checkSignIn, function (req, res) {\n  var userId = req.params.userId;\n  User.deleteOne({\n    _id: userId\n  }).exec(function (err, doc) {\n    if (err) {\n      console.log(err);\n    } else {\n      console.log(\"User deleted successfully\");\n      res.redirect(\"/getusers\");\n    }\n  });\n}); // POST requests//\n// user update\n\napp.post(\"/user/update\", checkSignIn, function (req, res) {\n  var userId = req.body.user_id;\n  User.findOneAndUpdate({\n    _id: userId\n  }, {\n    name: req.body.name,\n    age: req.body.age,\n    nationality: req.body.nationality\n  }, function (err) {\n    if (err) {\n      console.log(err);\n    } else {\n      console.log(\"User updated successfully\");\n      res.redirect(\"/getusers\");\n    }\n  });\n});\napp.post(\"/login\", function (req, res, next) {\n  let stopFlag = false;\n  User.find({\n    username: req.body.username\n  }).then(function (user) {\n    if (user.length == 0 || typeof user === \"undefined\") {\n      console.log(\"Username is incorrect\");\n      req.flash({\n        type: \"info\",\n        message: \"Username is incorrect\",\n        redirect: false\n      });\n      stopFlag = true;\n      pusher.trigger(\"my-channel\", \"my-event\", {\n        message: \"Username is incorrect\"\n      }); //  res.sendView(\"login\");\n    }\n\n    req.session.user = user;\n    req.session.username = {\n      username: req.body.username\n    };\n    var userPassword = \"\";\n    user.map(user => {\n      userPassword = user.password;\n    });\n    return bcrypt.compare(req.body.password, userPassword);\n  }).then(function (samePassword) {\n    if (!samePassword && !stopFlag) {\n      console.log(\"Password is incorrect\");\n      pusher.trigger(\"my-channel\", \"my-event\", {\n        message: \"Password is incorrect\",\n        status: \"error\"\n      }); // res.sendView(\"login\");\n    } else if (!stopFlag) {\n      console.log(\"password matched !\");\n      res.status(\"200\");\n      res.sendView(\"home\");\n    }\n  }).catch(function (err) {\n    console.log(\"Error:\" + err);\n  });\n});\napp.post(\"/signup\", function (req, res, next) {\n  if (req.body.username == \"\" || req.body.password == \"\") {\n    res.status(\"400\");\n    pusher.trigger(\"my-channel\", \"my-event\", {\n      message: \"Please enter username and password\",\n      status: \"error\"\n    }); //res.send(\"Please enter username and password\");\n  } else {\n    // check username already exists\n    User.find({\n      username: req.body.username\n    }, function (err, user) {\n      if (err) {\n        console.log(\"Signup error\");\n        return done(err);\n      } else {\n        if (user.length != 0) {\n          console.log(\"username already exists\");\n          pusher.trigger(\"my-channel\", \"my-event\", {\n            message: \"username already exists please choose a different one\",\n            status: \"error\"\n          }); // res.send(\"username already exists please choose a different one\");\n        }\n      }\n    });\n    var BCRYPT_SALT_ROUNDS = 12;\n    bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then(function (hashedPassword) {\n      var newUser = new User({\n        username: req.body.username,\n        password: hashedPassword,\n        name: req.body.name,\n        age: req.body.age,\n        nationality: req.body.nationality\n      }); // save the user\n\n      newUser.save(function (err, Person) {\n        // save the user to a session\n        req.session.user = newUser;\n        console.log(\"user registered successfully\");\n        pusher.trigger(\"my-channel\", \"my-event\", {\n          message: \"user registered successfully\",\n          status: \"success\"\n        });\n      });\n    }).then(function () {//res.redirect(\"/login\");\n    }).catch(function (error) {\n      console.log(\"Error saving user: \");\n      console.log(error);\n      next();\n    });\n  }\n}); // bind to a port\n\nvar server = app.listen(3000, function () {\n  var host = server.address().address;\n  var port = server.address().port;\n  console.log(\" app listening at http://%s:%s\", host, port);\n});\n\n//# sourceURL=webpack:///./server.js?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "ejs":
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ejs\");\n\n//# sourceURL=webpack:///external_%22ejs%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-flash-notification":
/*!*********************************************!*\
  !*** external "express-flash-notification" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-flash-notification\");\n\n//# sourceURL=webpack:///external_%22express-flash-notification%22?");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-session\");\n\n//# sourceURL=webpack:///external_%22express-session%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "pusher":
/*!*************************!*\
  !*** external "pusher" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pusher\");\n\n//# sourceURL=webpack:///external_%22pusher%22?");

/***/ })

/******/ });