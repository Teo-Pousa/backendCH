const fs = require('fs');

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
