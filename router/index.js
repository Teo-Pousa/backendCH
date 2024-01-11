const express = require('express');
const productsController = require('../controllers/productsController');
const cartsController = require('../controllers/cartsController');

const CartManager = require('./cartManager');
const CartManager = new CartManager('cart.json');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', productsController.addProduct);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);

router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.get('/:cid', cartsController.getCart);
router.post('/', cartsController.addProductToCart);

const expressHandlebars = require('express-handlebars');
const productsRouter = require('../router/index');
// Configuración de Handlebars
app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/src/views');
// Rutas principales
app.use('/api/products', productsRouter);


const Products = require('./productManager');
const productManager = new Products('products.json');
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



module.exports = router;