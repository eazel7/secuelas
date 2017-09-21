module.exports = (server, api) => {
    var io = require('socket.io')(server);

    return io;
};