/* SafeDragon - NodeJS */
/* Copyright (C) 2018 0x22fe */

const PORT = 9111;
const NAME = "SafeDragon Server";
const HELP = "Helpful Commands:\nmsg, event, pause, resume, stop, & help\n";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

var running = true;
var users = [];

app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  var usr = "Unknown";
  var hasset = false;
  var userid = -1;

  if (running) socket.broadcast.emit(NAME + ': Welcome to the chat!');
  if (running)
    socket.broadcast.emit('CHAT_MESSAGE', 'A new user has joined!', '');

  socket.on('CHAT_MESSAGE', function (username, msg) {
    if (!hasset) {
      usr = username;
      users.find(function (val) {
        if (usr == val) usr += '-New';
      });
      userid = users.length;
      users.push(usr);
      hasset = true;
    }
    if (running) console.log(usr + ': ' + msg);
    if (running) socket.broadcast.emit('CHAT_MESSAGE', username, msg);
  });

  socket.on('disconnect', function () {
    if (running) console.log(usr + ' has left');
    if (userid !== -1) users.splice(userid, 1);
    if (running) socket.broadcast.emit('CHAT_MESSAGE', usr + ' has left', '');
  });
});

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
  var txt = d.toString().trim();

  if (txt.substring(0, 3).toLowerCase() === "msg" && txt.length > 4) {
    io.emit("CHAT_MESSAGE", NAME, txt.substring(4, txt.length));
  } else if (txt.substring(0, 5).toLowerCase() === "event") {
    var splittxt = txt.substring(6, txt.length).split('|');
    // Send event -> name, message, (time), & status
    io.emit(
      "NOTIFICATION_EVENT", splittxt[0], splittxt[1],
      new Date(Date.now()).toLocaleString(), splittxt[2]);
  } else if (txt.substring(0, 5).toLowerCase() === "stop") {
    io.emit("CHAT_MESSAGE", NAME + ' is shutting down', '');
    process.disconnect();
    process.exit(0);
  } else if (txt.substring(0, 6).toLowerCase() === "pause") {
    running = false;
  } else if (txt.substring(0, 7).toLowerCase() === "resume") {
    running = true;
  } else if (txt.substring(0, 4).toLowerCase() === "help") {
    console.log(HELP);
  } else {
    console.log("Unknown command");
  }
});

http.listen(PORT, function () {
  console.log(NAME + " has started!");
  console.log('Server listening on *:' + PORT);
  console.log(HELP);
});
