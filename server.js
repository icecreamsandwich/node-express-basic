var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//connect to mongodb
mongoose.connect('mongodb://localhost/test');
var User = require("./models/user")
//start the express server
var app = express();

function sendViewMiddleware(req, res, next) {
    res.sendView = function (view) {
        return res.sendFile(__dirname + "/pages/" + view + ".html");
    }
    next();
}

app.use(sendViewMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendView("login")
});

function checkSignIn(req, res) {
    if (req.body.username) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
    }
}

    app.post('/login', function (req, res) {
        var response = {
            username: req.body.username,
            password: req.body.password,
        }
        res.send(JSON.stringify(response));
      /*   Person.findById(username, function(err, response){
            console.log(response);
            res.redirect("home")
         },function(err){
            res.status(500).json({message: 'This user does not exist'});
            console.error(err);
        }); */
    });
    app.get('about', function (req, res) {
        res.sendView("about")
    });
    app.get('contact', function (req, res) {
        res.sendView("contact")
    });

    app.get('home', checkSignIn, function (req, res) {
        res.sendView("home")
    });
    app.get('signup', function (req, res) {
        res.sendView("signup")
    });
    app.post('signup', function (req, res) {
        var Users = [];
        if (req.body.username == "" || req.body.password == "") {
            res.status("400")
            res.send("Please enter username and password")
        }
        else {
            Users.filter(function (user) {
                if (user.username == req.body.username) {
                    res.sendView("signup", { message: "User already exists, please choose another username" });
                }
                var newUser = new User({
                    name: personInfo.name,
                    age: personInfo.age,
                    nationality: personInfo.nationality
                });

                newUser.save(function (err, Person) {
                    res.redirect("home", { message: "Welcome user" });
                });
            });
        }
    });


var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(" app listening at http://%s:%s", host, port)
});
