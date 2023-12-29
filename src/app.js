

const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const Products = require('./productManager');
const productsRouter = require('../router/index');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8080;

const productManager = new Products('products.json');

const CartManager = require('./cartManager');
const CartManager = new CartManager('cart.json');

// Configuración de Handlebars
app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/src/views');
// Rutas principales
app.use('/api/products', productsRouter);

// Socket.io configuration
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
// Cuando agregues o elimines un producto
io.emit('productUpdate', 'Actualización de productos');
// Vista Home con todos los productos
app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});
// Vista Home
app.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

app.get('/', (req, res) => {
    res.render('home', { layout: 'layouts/main' });
});

let productsData = [];
try {
    const rawData = fs.readFileSync('products.json');
    productsData = JSON.parse(rawData);
} catch (error) {
    console.error('Error al leer el archivo products.json:', error);
}

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});


// Vista RealTimeProducts con WebSockets
app.get('/realTimeProducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});
app.get('/websockets', (req, res) => {
    res.render('websockets', { layout: 'layouts/main' });
});

server.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});