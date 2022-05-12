const Data = require('./message');


let myDatabase = function() {
    this.message = [];
    
}

let messageIndex = 0;

myDatabase.prototype.displayData = function() {
    for (let i=0;i<this.message.length;i++) {
        console.log(this.message[i]);
    }
}
myDatabase.prototype.getmessageLength = function(_data) {
return this.message.length;
}
myDatabase.prototype.postData = function(_data) {
  this.message[messageIndex++] =
  new Data(_data.message,_data.id,_data.user,_data.type,_data.color,_data.comments,_data.realMessage);
  return true;
}
myDatabase.prototype.postComment = function(id,comment) {
  let i = id-1;
  this.message[i].comments += "<br> " + comment + " <br>" 
  return true;
}

myDatabase.prototype.getData = function(id) {
  for (let i=0;i<this.message.length;i++) {
    if ( id == i)
    {
      return(new Data(this.message[i].message, this.message[i].id,this.message[i].user,this.message[i].type,this.message[i].color,this.message[i].comments,this.message[i].realMessage));
    }
  }
  return "snuggy wuggy";
}

myDatabase.prototype.putData = function(_data) {
  for (let i=0;i<this.message.length;i++) {
    if (this.message[i] && this.message[i].id == _data.id ) {
      this.message[i] =
      new Data(_data.message,_data.id,_data.user,_data.type,_data.color,_data.comments,_data.realMessage);
      return true;
    }
  }
  return false;
}

myDatabase.prototype.deleteData = function(id) {
  for (let i=0;i<this.message.length;i++) {
    if (this.message[i] && id == this.message[i].id) {
        let tempPtr = this.message[i];
        this.message[i] = undefined;
        return tempPtr;
    }
  }
  return null;
}

module.exports = myDatabase;
