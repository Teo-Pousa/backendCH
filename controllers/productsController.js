const { v4: uuidv4 } = require('uuid');
const productManager = require('../productManager');

exports.getProducts = async (req, res) => {
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
};

exports.getProductById = async (req, res) => {
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
};

exports.addProduct = async (req, res) => {
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
};

exports.updateProduct = async (req, res) => {
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
};

exports.deleteProduct = async (req, res) => {
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
};
