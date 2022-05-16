let path = require("path");
let express = require("express");
var formidable = require('formidable');
var mv = require('mv');
var passport = require("passport");

//Look at below web page for info on express.Router()
//https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
let router = express.Router();

//request is info sending to server from client.
//response is info sending to client from server.

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

//////////////////////////////////////////////////////

router.get("/successroot", function(req, res) {
  res.json({redirect:"/"});
});
router.get("/failroot", function(req, res) {
  res.json({redirect:"/"});
});
router.get("/successsignup", function(req, res) {
  res.json({redirect:"/profile"});
});
router.get("/failsignup", function(req, res) {
  res.json({redirect:"/profileLogin"});
});
router.get("/successlogin", function(req, res) {
  res.json({redirect:"/profile"});
});
router.get("/faillogin", function(req, res) {
  res.json({redirect:"/profileLogin"});
});

///////////////////////////////////////////////

router.get("/",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/index.html"));  //changed
});
router.get("/profile",function(req,res){
  let thePath;
  if (req.isAuthenticated()) {
    thePath = path.resolve(__dirname + "/public/views/profile.html");
    res.sendFile(thePath);
  } else {
    thePath = path.resolve(__dirname + "/public/views/profileLogin.html");
    res.sendFile(thePath);
  }
});
router.get("/signup", function(req, res) {
  let thePath = path.resolve(__dirname,"public/views/signup.html");
  res.sendFile(thePath);
});
router.get("/profileLogin",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/profileLogin.html"));  //changed
});
router.get("/survey",function(req,res){
  let thePath;
  if (req.isAuthenticated()) {
    thePath = path.resolve(__dirname + "/public/views/survey.html");
    res.sendFile(thePath);
  } else {
    res.json({redirect:"/profileLogin"});
  }
});
/*
router.get("/yeeside",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/yeelogin.html"));  //changed
});
router.get("/yeeview",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/yeeview.html"));  //changed
});
*/
router.get("/userInfo",function(req,res){
  if (req.isAuthenticated()) {
    console.log("req isAuthenticated");
    res.json({username:req.user.username});
  }
  else {
    console.log("req is not Authenticated");
    res.json(null);
  }
});
router.get("/logout", function(req, res) {
  if (req.isAuthenticated()) {
    console.log("logout successful");
    req.logout();
    res.redirect("/successroot");
  } else {
    res.redirect("/failroot");
  }
});
router.post("/login", passport.authenticate("login", {
  successRedirect: "/successlogin",
  failureRedirect: "/faillogin",
  failureFlash: true
}));

/////////////////////////////////////////////////

const myDatabase = require('./myDatabase');
let db = new myDatabase();


const mymessDatabase = require('./messageDatabase');
let messageDb = new mymessDatabase();


const Data = require('./Data');
const MessageData = require('./message');
let messageID = 1;
let filename2;

//////////////////////////////////
router.post('/fileupload', function(req, res) {
    console.log("router.post fileupload");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.path;
        var newpath = __dirname + '/public/images/' + files.image.name;
        console.log('Received image: ' + files.image.name);
        mv(oldpath, newpath, function (err) {
//            if (err) throw err;
            if (err)
                res.json({error:false,filename2: "empty.webp"});
            else
                res.json({error:false,filename2: files.image.name });
        });
    });
});

router.post('/storeMessage', function(req, res){
  let message = req.body.message.trim();
  let id = req.body.id.trim();
  let user = req.body.user.trim();
  let type = req.body.type.trim();
  let color = req.body.color.trim();
  let comments = req.body.comments;
  let realMessage = req.body.realMessage.trim();
 //let survey= req.body.survey.trim();

  if (message == "") {
      res.json({error:true,message:"Bad Message"});
      return;
  }

  let obj = new MessageData(message,id,user,type,color,comments,realMessage); //the -1 is temporary, is the yee rating
  let val = messageDb.postData(obj);
  messageID++;
  console.log(val);
  if (val)
    res.json({error:false});
  else
    res.json({error:true});

});
router.post('/storeComment', function(req, res){
  let message = req.body.text.trim();
  let id = req.body.messageID.trim();
  let user = req.body.user.trim();
 //let survey= req.body.survey.trim();

  if (message == "") {
      res.json({error:true,message:"Bad Message"});
      return;
  }

  let comment = " " + user + ": " + message;
  let val = messageDb.postComment(id,comment);
  messageID++;
  console.log(val);
  if (val)
    res.json({error:false});
  else
    res.json({error:true});

});
router.get('/getstoredMessages', function(req, res){
  let chat = "";
  let newmessageId;
  console.log(messageDb.getmessageLength());
  if(messageDb.getmessageLength()>0){
    for(let i =0; i<messageDb.getmessageLength();i++) {
      let newMessage = messageDb.getData(i);
      let type = newMessage.type;

      if(type == "Text") {
        chat += (
        '<div class="postBlock">' +
        '<p class="postli" style="background-color:'+ newMessage.color +';">' + newMessage.message + ": " + newMessage.user + '<br>'+'<body>'+newMessage.realMessage+'</body>'+'</p>'+
        '<div>' +

        "<button type=button id='" + newMessage.id + "'class='collapsible' " + 'style="background-color:'+ newMessage.color + ';">' + 'Comments</button>'+

        "<div id =" + "d"+ newMessage.id + " class="+ "content"+"> " +"<hr>"
          +"<ul id=" + "p"+ newMessage.id + ">"+newMessage.comments+  " </ul>" + "<br>"
          +"<input id =" + "t" + newMessage.id + " type="+ "text"+">"
          +"<input id =" + "c"+ newMessage.id + " type=button name=commentb" +
          "value=PostComment onclick= " + "commentit("+  newMessage.id + ")>" +"<br>"
        +"</div>"
        +"</div>"
        +"</div>"
        );
      }
      else if(type == "Image") {
        chat += (
        '<div class="postBlock">' +
        "<p class='imageUser'>" + newMessage.user + "</p>" +
        "<img id='display' class='postli'" + 'style="background-color:'+ newMessage.color +';" src="images/' + newMessage.message +'"height="150" width="150">' +

        '<div>' +

      "<button type=button id='" + newMessage.id + "'class='collapsible' " + 'style="background-color:'+ newMessage.color + ';">' + 'Comments</button>'+

      "<div id =" + "d"+ newMessage + " class="+ "content"+"> " +"<hr>"
        +"<ul id=" + "p"+ newMessage.id + ">"+newMessage.comments+  "</ul>" + "<br>"
        +"<input id =" + "t" + newMessage.id + " type="+ "text"+">"
        +"<input id =" + "c"+ newMessage.id + " type=button name=commentb" +
        "value=PostComment onclick= " + "commentit("+  newMessage.id + ")>" +"<br>"
      +"</div>"
      +"</div>"
      +"</div>"
        );
      }
      newmessageId = newMessage.id;
    }
  }
  res.json({test:chat, IDs:newmessageId});

});
router.get('/getMessageid', function(req, res){
  res.json(messageID);

});

module.exports = router;
