/* const fs = require('fs');

class Products {
    constructor(filePath) {
    this.path = filePath;
    this.elements = this.loadProducts();
    this.id = this.calculateNextId();
}

loadProducts() {
    try {
        const data = fs.readFileSync(this.path, 'utf8');
    return JSON.parse(data) || [];
        } catch (error) {
    return [];
    }
}

saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.elements, null, 2), 'utf8');
}

calculateNextId() {
    return this.elements.length > 0 ? Math.max(...this.elements.map(e => e.id)) + 1 : 1;
}

addProduct(title, description, price, thumbnail, code, stock) {
    if (title && description && price && thumbnail && code && stock) {
        const encontrado = this.elements.findIndex(e => e.code === code);
    if (encontrado === -1) {
        const data = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id: this.id++
        };
        this.elements.push(data);
        this.saveProducts();
        console.log("Producto agregado correctamente:", data);
    } else {
        console.log("El código ingresado ya existe.");
    }
    } else {
        console.log("Faltan datos para agregar el producto.");
    }
}

getProductById(id) {
    const data = this.elements.find(e => e.id === id);
    if (data) {
        console.log("Producto encontrado:", data);
        return data;
    } else {
    console.log("No se encontró ningún producto con ese ID.");
        return null;
    }
}

getProducts() {
    return this.elements;
}

updateProduct(id, updatedFields) {
    const productIndex = this.elements.findIndex(p => p.id === id);
        if (productIndex !== -1) {
    this.elements[productIndex] = { ...this.elements[productIndex], ...updatedFields };
    this.saveProducts();
    console.log("Producto actualizado:", this.elements[productIndex]);
        return this.elements[productIndex];
        } else {
    console.log("No se encontró ningún producto con ese ID.");
        return null;
    }
}

deleteProduct(id) {
    const initialLength = this.elements.length;
    this.elements = this.elements.filter(p => p.id !== id);
    if (this.elements.length < initialLength) {
        this.saveProducts();
        console.log("Producto eliminado correctamente.");
        return true;
    } else {
        console.log("No se encontró ningún producto con ese ID.");
        return false;
    }
    }
}


const productManager = new Products('productos.json');

productManager.addProduct("Poner", "Nuevos", 100, "Datos", "Aca", 546);

productManager.addProduct("producto2", "descripción2", 200, "imagen2", "131", 789);

console.log(productManager.getProducts());

console.log(productManager.getProductById(1));

console.log(productManager.getProductById(5));

productManager.updateProduct(1, { price: 150, stock: 600 });

productManager.deleteProduct(2);
 */

const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async saveProducts(products) {
        try {
            const jsonData = JSON.stringify(products, null, 2);
            await fs.writeFile(this.filePath, jsonData, 'utf8');
        } catch (error) {
            console.error("Error al guardar los productos:", error);
            throw error;
        }
    }

    async calculateNextId() {
        try {
            const products = await this.getProducts();
            const maxId = products.length > 0 ? Math.max(...products.map(e => e.id)) : 0;
            return maxId + 1;
        } catch (error) {
            console.error("Error al calcular el próximo ID:", error);
            throw error;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const products = await this.getProducts();

            const encontrado = products.some(e => e.code === code);
            if (!encontrado) {
                const newId = await this.calculateNextId();
                const data = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    id: newId
                };

                products.push(data);
                await this.saveProducts(products);
                console.log("Producto agregado correctamente:", data);
            } else {
                console.log("El código ingresado ya existe.");
            }
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

async addProduct(product) {
    try {
        const products = await this.getProducts();

        const encontrado = products.some(e => e.code === product.code);
        if (!encontrado) {
            const newId = await this.calculateNextId();
            product.id = newId; // Agregar el ID al producto
            products.push(product);
            await this.saveProducts(products);
            console.log("Producto agregado correctamente:", product);
        } else {
            console.log("El código ingresado ya existe.");
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

async addProduct(product) {
    try {
        const products = await this.getProducts();

        const encontrado = products.some(e => e.code === product.code);
        if (!encontrado) {
            const newId = await this.calculateNextId();
            product.id = newId;
            products.push(product);
            await this.saveProducts(products);
            console.log("Producto agregado correctamente:", product);
        } else {
            console.log("El código ingresado ya existe.");
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const data = products.find(e => e.id === id);
            if (data) {
                console.log("Producto encontrado:", data);
                return data;
            } else {
                console.log("No se encontró ningún producto con ese ID.");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            return null;
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error("Error al obtener todos los productos:", error);
            return [];
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex !== -1) {
                products[productIndex] = { ...products[productIndex], ...updatedFields };
                await this.saveProducts(products);
                console.log("Producto actualizado:", products[productIndex]);
                return products[productIndex];
            } else {
                console.log("No se encontró ningún producto con ese ID.");
                return null;
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const initialLength = products.length;
            const updatedProducts = products.filter(p => p.id !== id);

            if (updatedProducts.length < initialLength) {
                await this.saveProducts(updatedProducts);
                console.log("Producto eliminado correctamente.");
                return true;
            } else {
                console.log("No se encontró ningún producto con ese ID.");
                return false;
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return false;
        }
    }
}

module.exports = ProductManager;


/* (async () => {
    const productManager = new Products('productos.json');

    await productManager.addProduct("Poner", "Nuevos", 100, "Datos", "Aca", 546);

    await productManager.addProduct("producto2", "descripción2", 200, "imagen2", "131", 789);

    console.log(await productManager.getProducts());

    console.log(await productManager.getProductById(1));

    console.log(await productManager.getProductById(5));

    await productManager.updateProduct(1, { price: 150, stock: 600 });

    await productManager.deleteProduct(2);
})(); */
