const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async saveCart(cart) {
        try {
            const jsonData = JSON.stringify(cart, null, 2);
            await fs.writeFile(this.filePath, jsonData, 'utf8');
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            throw error;
        }
    }

    async getCart() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || { id: null, products: [] };
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return { id: null, products: [] };
        }
    }

    async addProductToCart(productId, quantity = 1) {
        try {
            const cart = await this.getCart();
            const existingProductIndex = cart.products.findIndex(product => product.id === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }

            await this.saveCart(cart);
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }

    async removeProductFromCart(productId) {
        try {
            const cart = await this.getCart();
            const updatedProducts = cart.products.filter(product => product.id !== productId);
            cart.products = updatedProducts;
            await this.saveCart(cart);
        } catch (error) {
            console.error("Error al remover producto del carrito:", error);
            throw error;
        }
    }
}

module.exports = CartManager;
