var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes");
let http = require('http');


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/js', express.static('./public/js'));
app.use('/',express.static('./public'));
app.use(routes);

app.use('/favicon.ico', express.static('public/favicon.webp'));
app.use('/style.css', express.static('public/css/style.css'));

////////Socekt Code//////////

let server = http.createServer(app);
let io = require('socket.io')(server);

io.on('connection', function(socket) {

  socket.emit('welcome', { message: 'Welcome!', id: socket.id });

  socket.on('update', function (data) {
      io.emit('update', data);
  });
  socket.on('updateComments', function (data) {
      io.emit('updateComments', data);
  });

});
//////////////////////////////



var port = process.env.PORT || 3001;
server.listen(port);
