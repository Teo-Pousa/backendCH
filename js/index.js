/* class Products {
    constructor() {
    this.elements = [];
    this.id = 0;
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
}

const datos = new Products();
datos.addProduct("Poner", "Nuevos", 100, "Datos", "Aca", 546);
datos.addProduct("producto2", "descripción2", 200, "imagen2", "131", 789);
console.log(datos.getProducts());
console.log(datos.getProductById(1));
console.log(datos.getProductById(5)); */

