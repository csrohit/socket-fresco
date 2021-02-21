const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.send(`<!DOCTYPE html>
   <html>
      <head>
         <title>Hello world</title>
      </head>
      <script src = "/socket.io/socket.io.js"></script>
      
      <script>
         const socket = io();
         socket.on("connect", function() {
            console.log("connected");
        });
        socket.on("message", function(data) {
            // Log the data I received
            console.log(data);
            // Send a message to the server
            socket.emit("greetings", {some: "data"});
        });
        socket.on("disconnect", function(data) {
            // Log the data I received
            console.log(data);
            // Send a message to the server
            console.log("disconnect");
        });
      </script>
      <body>Hello</body>
   </html>`);
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.send('Hello!');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });

   io.on('greetings', data => {
    console.log(data);
});
});



http.listen(3000, function() {
   console.log('listening on *:3000');
});