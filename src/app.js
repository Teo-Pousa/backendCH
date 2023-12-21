

const express = require('express');
const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const Products = require('./productManager');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8080;

const productManager = new Products('products.json');

const productsRouter = express.Router();
const cartsRouter = express.Router();

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const CartManager = require('./cartManager');
const cartManager = new CartManager('cart.json');

// Configuración de Handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);

// rutas productos
productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit, 10));
            res.json({ products: limitedProducts });
        } else {
            res.json({ products });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Error al obtener el producto por ID.' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = {
            id: uuidv4(),
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || [],
        };

        await productManager.addProduct(newProduct);
        res.json({ message: 'Producto agregado correctamente.', product: newProduct });
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error);
        res.status(500).json({ error: 'Error al agregar un nuevo producto.' });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        const updatedProduct = {
            id: productId,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || [],
        };

        await productManager.updateProduct(updatedProduct);
        res.json({ message: 'Producto actualizado correctamente.', product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        await productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente.', productId });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

// rutas carritos
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = {
            id: uuidv4(),
            products: [],
        };

        // persistencia carrito
        await fs.writeFile('cart.json', JSON.stringify(newCart, null, 2));

        res.json({ message: 'Carrito creado correctamente.', cart: newCart });
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).json({ error: 'Error al crear un nuevo carrito.' });
    }
});
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        await cartManager.addProductToCart(productId, quantity);
        res.json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito.' });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartData = await fs.readFile('carrito.json', 'utf-8');
        const cart = JSON.parse(cartData);

        res.json({ cart });
    } catch (error) {
        console.error('Error al obtener el carrito por ID:', error);
        res.status(500).json({ error: 'Error al obtener el carrito por ID.' });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        // obtener carrito actual
        const cartData = await fs.readFile('carrito.json', 'utf-8');
        const cart = JSON.parse(cartData);

        // verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find((product) => product.id === productId);

        if (existingProduct) {
            // incrementar la cantidad si el producto ya está en el carrito
            existingProduct.quantity += quantity;
        } else {
            // agregar el producto al carrito
            cart.products.push({ id: productId, quantity });
        }

        // actualizar el archivo de carrito con la nueva información
        await fs.writeFile('carrito.json', JSON.stringify(cart, null, 2));

        res.json({ message: 'Producto agregado al carrito correctamente.', cart });
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar un producto al carrito.' });
    }
});

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
// Vista RealTimeProducts con WebSockets
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
server.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});