const port = 8000;
const io = require('socket.io')(port, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        allowHeaders: ["my-custom-header"],
        creadentials: true,
    }
});

let users = {};

io.on('connection', (socket) => {
    socket.on('new-user-join', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', (name) => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})