const { Router } = require('express')
const CartManager = require('../dao/CartsManagerMongo')

const cartManager = new CartManager()

const cartsRouter = Router()


cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        return res.status(200).json({ status: 'success', payload: carts })
    } catch (error) {
        const commonErrorMessage ='Error al obtener los carritos'
        if (error.message === 'No se encuentran carritos en nuestra base de datos') {
            return res.status(404).json({ error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await cartManager.getCartById(cid)
        return res.status(200).json({ status: 'success', payload: cart })
    } catch (error) {
        const commonErrorMessage = 'Error al obtener el carrito'
        if (error.message = 'No se encuentra el carrito') {
            return res.status(404).json({ error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.post('/', async (req, res) => {
    try {
        await cartManager.addCart();
        return res.status(201).json({ status: 'success', message: 'Carrito agregado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al agregar el carrito', message: error.message });
    }
})

cartsRouter.post('/:cid/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        await cartManager.addProductToCart(cid, pid);
        return res.status(201).json({ status: 'success', message: 'Se ha guardado el producto en el carrito exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al guardar el producto en el carrito';
        if (error.message === 'Producto no encontrado en el inventario') {
            return res.status(404).json({ error: 'Producto no encontrado', message: 'El producto que intentas agregar no existe en el inventario' });
        }
        if (error.message === 'No se encuentra el carrito') {
            return res.status(404).json({ error: 'Carrito no encontrado', message: 'El carrito que intentas usar no existe' });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {await cartManager.removeProductFromCart(cid, pid);
        return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al eliminar el producto del carrito';
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});



cartsRouter.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const products = req.body.products;
    try { await cartManager.updateCartProducts(cid, products);
        return res.status(200).json({ status: 'success', message: 'Carrito actualizado exitosamente' });
    }catch (error) {
        const commonErrorMessage = 'Error al actualizar el carrito';
        // Handle specific error cases if needed
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
}); 


cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    try {await cartManager.updateProductQuantity(cid, pid, quantity);
        return res.status(200).json({ status: 'success', message: 'Cantidad de producto actualizada exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al actualizar la cantidad del producto';

        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});



cartsRouter.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {  await cartManager.clearCart(cid);
        return res.status(200).json({ status: 'success', message: 'Productos eliminados del carrito exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al eliminar los productos del carrito';
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
    });

module.exports = cartsRouter


