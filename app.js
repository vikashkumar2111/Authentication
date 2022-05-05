//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5"); 
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB");

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});  

const User = mongoose.model("user",userSchema);

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
    const user = new User({
        name: req.body.username,
        password: md5(req.body.password)
    });

    user.save(err => {
        if(!err){
            res.render("secrets"); 
        } else {
            res.send(err);
        }
    })
});  

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({name: username}, (err, user) => {
        if(err){
            res.send(err);
        } else if(!err){
            if(user){
                if(user.password === password){
                    res.render("secrets");
                }
            }
        } 
    })
});
  
app.listen(3000, () => {
    console.log("Server is running on port 3000."); 
}); 