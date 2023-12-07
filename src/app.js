const express = require('express');
const Products = require('./productManager');

const app = express();
const PORT = 3000;

const productManager = new Products('productos.json');

app.use(express.json());

app.get('/products', async (req, res) => {
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


app.get('/products/:pid', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
