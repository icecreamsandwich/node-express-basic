var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var User = require("./models/user")

//connect to mongodb
mongoose.connect('mongodb://localhost/test',{'useNewUrlParser': true,'useCreateIndex': true},function(req,res){
    console.log("connected to mongo!!")
});

//start the express server
var app = express();
/* app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname); */

function sendViewMiddleware(req, res, next) {
    res.sendView = function (view) {
        return res.sendFile(__dirname + "/pages/" + view + ".html");
    }
    next();
}

app.use(sendViewMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "Your secret key"}));

app.get('/', function (req, res) {
    res.sendView("login")
});

app.get('/login', function (req, res) {
    res.sendView("login")
});

app.get('/logout', function (req, res) {
     //destroy the session
     req.session.destroy(function(){
        console.log("User successfully logged out")
     });
    res.sendView("login")
});

function checkSignIn(req, res, next) {
    //check if the user exists
    if(req.session.user){
        //console.log(req.session.user);
        next();
    }
    else{
        console.log("User is not authenticated");
        res.redirect('/login');
    }
}

    app.post('/login', function (req, res, next) {
        User.find({'username':req.body.username})
            .then(function(user){
                if((user.length	==  0) || typeof user == 'undefined'){
                    console.log("Username is incorrect")
                    res.send("Username is incorrect")
                }
                req.session.user =user;
                var userPassword = "";
                user.map(user => {
                     userPassword = user.password;
                })
                return bcrypt.compare(req.body.password,userPassword)
            })
            .then(function(samePassword){
                if(!samePassword){
                    res.send("Password is incorrect")
                }
                else {                   
                    console.log("password matched !")
                    res.status('200');
                    res.sendView("home",{username:req.body.username})
                }  
            })
            .catch(function(err){
                console.log("Error:"+err)
            });
    });

    app.get('/about', function (req, res) {
        res.sendView("about")
    });

    app.get('/contact', function (req, res) {
        res.sendView("contact")
    });

    app.get('/home', checkSignIn,function (req, res) {
        res.sendView("home")
    });
    app.get('/signup', function (req, res) {
        res.sendView("signup")
    });

    app.post('/signup', function (req, res,next) {
        if (req.body.username == "" || req.body.password == "") {
            res.status("400")
            res.send("Please enter username and password")
        }
        else {
            //check username already exists
            User.find({'username':req.body.username},function(err,user){
                if(err){
                    console.log("Signup error")
                    return done(err);
                }
                else{
                    if(user.length !=0){
                        console.log("username already exists")
                        res.send("username already exists please choose a different one")
                    }
                }
            });

            var BCRYPT_SALT_ROUNDS = 12;
            bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then(function(hashedPassword) {
                var newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    name: req.body.name,
                    age: req.body.age,
                    nationality: req.body.nationality
                });
                
                //save the user
                newUser.save(function (err, Person) {
                    //save the user to a session
                    req.session.user =newUser;
                    console.log("user registered successfully")
                });
            })
            .then(function() {
                res.redirect("/login");
            })
            .catch(function(error){
                console.log("Error saving user: ");
                console.log(error);
                next();
            });
        }
    });


var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(" app listening at http://%s:%s", host, port)
});
