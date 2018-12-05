var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var app = express();

function sendViewMiddleware(req, res, next) {
    res.sendView = function(view) {
        return res.sendFile(__dirname + "/pages/" + view);
    }
    next();
}

app.use(sendViewMiddleware);

app.get('/',function(req,res){
    res.sendView("login.html")
});

app.post('/login',function(req,res){
   
});
app.get('about',function(req,res){
    res.sendView("about.html")
});
app.get('contact',function(req,res){
    res.sendView("contact.html")
});


var server = app.listen(3000,function(){
    var host = server.address().address
    var port = server.address().port
     console.log(" app listening at http://%s:%s", host, port)
});
