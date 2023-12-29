const fs = require('fs').promises;
const cartManager = require('../src/cartManager');
const { v4: uuidv4 } = require('uuid');
exports.addProductToCart = async (req, res) => {
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
    };
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
    
            await cartManager.addProductToCart(productId, quantity);
            res.json({ message: 'Producto agregado al carrito correctamente.' });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ error: 'Error al agregar producto al carrito.' });
        };

/* cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        // obtener carrito actual
        const cartData = await fs.readFile('cart.json', 'utf-8');
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
        await fs.writeFile('cart.json', JSON.stringify(cart, null, 2));

        res.json({ message: 'Producto agregado al carrito correctamente.', cart });
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar un producto al carrito.' });
    }
});
 */
exports.getCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cartData = await fs.readFile('cart.json', 'utf-8');
            const cart = JSON.parse(cartData);
            res.json({ cart });
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            res.status(500).json({ error: 'Error al obtener el carrito por ID.' });
        }
    };