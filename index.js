const express = require('express');
const fs = require('fs/promises');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas 
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {

// Obtener y enviar los productos
try {
    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    res.json(products);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos.' });
}
});

productsRouter.get('/:pid', async (req, res) => {
const productId = req.params.pid;

// Obtener y enviar un producto por su ID
try {
    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === productId);
    if (product) {
    res.json(product);
    } else {
    res.status(404).json({ error: 'Producto no encontrado.' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto.' });
}
});

productsRouter.post('/', async (req, res) => {
const newProduct = req.body;

// Agrego un nuevo producto
try {
    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    const newProductId = Math.random().toString(36).substr(2, 9); // Autogenerar ID
    const productWithId = { id: newProductId, ...newProduct };
    products.push(productWithId);
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
    res.json(productWithId);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto.' });
}
});

productsRouter.put('/:pid', async (req, res) => {
const productId = req.params.pid;
const updatedProduct = req.body;

// Actualizo un producto por su ID
try {
    const data = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct, id: productId };
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
    res.json(products[index]);
    } else {
    res.status(404).json({ error: 'Producto no encontrado.' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
}
});

productsRouter.delete('/:pid', async (req, res) => {
const productId = req.params.pid;

//Para eliminar un producto por su ID
try {
    const data = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(data);
    products = products.filter(p => p.id !== productId);
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
    res.json({ message: 'Producto eliminado exitosamente.' });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
}
});

app.use('/api/products', productsRouter);

//Rutas para carrito
const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
const newCart = req.body;

// Implemento lógica para crear un nuevo carrito
try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(data);
    const newCartId = Math.random().toString(36).substr(2, 9); // Autogenerar ID
    const cartWithId = { id: newCartId, ...newCart };
    carts.push(cartWithId);
    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
    res.json(cartWithId);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito.' });
}
});

cartsRouter.get('/:cid', async (req, res) => {
const cartId = req.params.cid;

// Obtener y enviar los productos de un carrito por su ID
try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
    res.json(cart.products);
    } else {
    res.status(404).json({ error: 'Carrito no encontrado.' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito.' });
}
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
const cartId = req.params.cid;
const productId = req.params.pid;
const { quantity } = req.body;

// Agrego un producto al carrito por su ID
try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex !== -1) {
    const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
        carts[cartIndex].products.push({ product: productId, quantity });
    }
    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
    res.json(carts[cartIndex]);
    } else {
    res.status(404).json({ error: 'Carrito no encontrado.' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
}
});

app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${PORT}`);
});
