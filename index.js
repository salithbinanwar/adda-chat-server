const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

io.on('connection', (socket) => {
    console.log('an user connected');

    socket.on('message', data => {
        io.emit('message', data);
    });
    // document.getElementById('activeNum').innerHTML = socket.adapter.sids.size
    console.log("The number of connected sockets: " + socket.adapter.sids.size);

    io.emit('activePeo', socket.adapter.sids.size);

    socket.on("disconnect", () => {
        console.log(socket.id, "has left");
        console.log(socket.adapter.sids.size)
        io.emit('activePeo', socket.adapter.sids.size);
    });

});



httpServer.listen(process.env.PORT || 8080, () => console.log('server is live'))