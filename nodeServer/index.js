// this will handle socket io connections
const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket => {

    // when new user joins
    socket.on('user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // when user sends message
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    // when user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});