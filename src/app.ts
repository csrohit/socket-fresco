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
app.listen(PORT, () => {
    logger.info(`App listening on port: ${PORT}`);
});
io.on("connection", (socket: any) => {
    logger.info("a user connected");
    // whenever we receive a 'message' we log it out
    socket.on("message", (message: any) => {
        logger.info(message);
        socket.emit('event', {some: "data"});
    });

});
app.get('/', (req, res) => {
    return res.send("Hello sockets");
});

http = http.listen(3000, () => {
    logger.info("listening on *:3000");
});


