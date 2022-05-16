var express = require("express");
var mongoose = require("mongoose");
var DataModel = require("./models/userData");
const Data = require('./Data');

let myDatabase = function() {
}



myDatabase.prototype.postData = function(data,res) {
//  let obj = {ident:data.ident,name:data.name};
console.log(data.name + data.name);
  let obj = {name:data.name,picture:data.picture,yeescore:data.yeescore};   //added
  DataModel.create(obj,function(error,info) {
      if (error) {
          return res.json({error:true});
      }
      return res.json({error:false});
  });
}

myDatabase.prototype.getData = function(name,res) {

  DataModel.find({name:name},function(error,info) {
      if (error) {
          return res.json({error:true});
      }
      else if (info == null) {
          return res.json({error:true});
      }

      if (info.length == 1)
          return res.json({error:false,name:info[0].name,picture:info[0].picture,yeescore:info[0].yeescore});
      else
          return res.json({error:true});
   });
}

myDatabase.prototype.putData = function(data,res) {
  DataModel.findOneAndUpdate({name:data.name},{picture:data.picture},function(error,oldData) {
    if (error) {
      return res.json({error:true});
    }
    else if (oldData == null) {
      return res.json({error:true});
    }
    return res.json({error:false});
  });
}

myDatabase.prototype.putYeescore = function(data,res) {
  if(data.yeescore > -1) {
    DataModel.findOneAndUpdate({name:data.name},{yeescore:data.yeescore},function(error,oldData) {
      if (error) {
        return res.json({error:true});
      }
      else if (oldData == null) {
        return res.json({error:true});
      }
      return res.json({error:false});
    });
  }
  else {
    return res.json({error:true});
  }
}

myDatabase.prototype.deleteData = function(ident,res) {
    DataModel.remove({name:name},function(error,removed) {
        if (error) {
            return res.json({error:true});
        }
        if (removed.result.n == 0)
            return res.json({error:true});
        return res.json({error:false});
    });
}

module.exports = myDatabase;
