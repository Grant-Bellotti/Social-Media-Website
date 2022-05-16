var express = require("express");
var passport = require("passport");
var path = require("path");

var User = require("./models/user");
var router = express.Router();

const myDatabase = require('./myDatabase');    //added
let db = new myDatabase();

const Data = require('./Data');

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

///////////////////////////////////////////////////////////////////

router.post("/createUserInfo", function(req, res) {
  if (req.isAuthenticated()) {
    let name = req.user.username;
    let picture = req.body.picture;
    let yeescore = parseInt(req.body.yeescore);
    let obj = new Data(name,picture,yeescore);
    return(db.postData(obj,res));

  }
  else {
    res.json(null);
  }
});

router.post("/create", function(req, res, next) {
  let username = req.body.username.trim();
  let password = req.body.password.trim();

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/failsignup");
    }
    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);    //goes to user.js (userSchema.pre(save))
  });


}, passport.authenticate("login", {       //goes to setuppassport.js  (passport.use("login"))
  successRedirect: "/successsignup",
  failureRedirect: "/failsignup",
  failureFlash: true
}));

router.get("/getInfo", function(req, res) {
  if (req.isAuthenticated()) {
    let name = req.user.username;
    return(db.getData(name,res));

  } else {
    res.json(null);
  }
});

router.get('/checkAuthenticated', function(req, res){
  if (req.isAuthenticated()) {
    res.json({error:false,user:req.user.username});
  } else {
    res.json({error:true,message:"user is not authenticated"});
  }
});

router.put('/update', function(req, res){
  if (req.isAuthenticated()) {
    let name = req.user.username;
    let picture = req.body.picture.trim();
    let yeescore = parseInt(req.body.yeescore);

    if (picture == "") {
        picture = "images/empty.webp";
    }

    let obj = new Data(name,picture,yeescore);
    return(db.putData(obj,res));

  } else {
    res.json({error:true});
  }

});
router.post('/surveySubmit', function(req, res){
  let username = req.body.username.trim();
  let password = req.body.password.trim();
  let num = parseInt(req.body.surveyNumber);

  if (db.getData(username,password) && db.getData(username,password).rating >= 0) {
    res.json({error:true,message:"the survey has already been taken on this account"});
    return;
  }
  let done = false;
  for(let i=10; i>0; i--) {
    if(num >= (4*i) && !done) {
      num = i;
      done = true;
    }
  }
  console.log("Yee survey num: "+num);
  let tempData = db.getData(username,password);
  let obj = new Data(username,tempData.profilepic,num,password); //the 5 is temporary, is the yee rating
  let val = db.putData(obj);
  if (val)
    res.json({error:false,num:num});
  else
    res.json({error:true,message:"Incorrect username or password"});

});

module.exports = router;