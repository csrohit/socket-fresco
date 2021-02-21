import express, { Request, Response } from 'express';
import morgan from 'morgan';
import logger, { outStream } from './helpers/logger';
const app = express();
const PORT = 3000;

app.use(morgan((tokens, req: Request, res: Response) => {
    return JSON.stringify(
        {
            'method': tokens.method(req, res),
            'url': tokens.url(req, res),
            'status': tokens.status(req, res),
            'response-time': `${tokens['response-time'](req, res)} ms`,
            'host': req.hostname
        });
}, { stream: outStream }));
let http = require("http").Server(app);
const io = require("socket.io")(http);
io.on('connection', (socket: any) => {
    logger.info('A user connected');
    socket.send('Hello!');
    socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        logger.info('A user disconnected');
    });

});
app.get('/', (req, res) => {
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
         });
         socket.on("greetings", function(data) {
             // Log the data I received
             console.log("greetings",data);
             // Send a message to the server
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

http = http.listen(3000, () => {
    logger.info("listening on *:3000");
});


