const Data = require('./Data');

let myDatabase = function() {
    this.data = [];
}

let dataIndex = 0;

myDatabase.prototype.displayData = function() {
    for (let i=0;i<this.data.length;i++) {
        console.log(this.data[i]);
    }
}

myDatabase.prototype.postData = function(_data) {
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && this.data[i].username == _data.username) {
      return false;
    }
  }
  this.data[dataIndex++] =
  new Data(_data.username,_data.profilepic,_data.rating,_data.password);
  return true;
}

myDatabase.prototype.getData = function(username,password) {
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && username == this.data[i].username && password == this.data[i].password)
    {
      return(new Data(this.data[i].username,this.data[i].profilepic,
                      this.data[i].rating, null));
    }
  }
  return null;
}

myDatabase.prototype.putData = function(_data) {
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && this.data[i].username == _data.username && _data.password == this.data[i].password) {
      this.data[i] =
      new Data(_data.username,_data.profilepic,_data.rating,this.data[i].password);
      return true;
    }
  }
  return false;
}

myDatabase.prototype.deleteData = function(id) {
  for (let i=0;i<this.data.length;i++) {
    if (this.data[i] && username == this.data[i].username) {
        let tempPtr = this.data[i];
        this.data[i] = undefined;
        return tempPtr;
    }
  }
  return null;
}

module.exports = myDatabase;
