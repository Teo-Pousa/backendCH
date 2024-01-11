

const express = require('express');

const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8080;


// Socket.io configuration
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
// Cuando agregues o elimines un producto
io.emit('productUpdate', 'Actualización de productos');

server.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});