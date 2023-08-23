const cartModel = require('./models/cartModel')
const productModel = require('./models/productModel')

class CartManagerMongo {
    constructor() {
        this.model = cartModel
    }

    async getCarts() {
        try {
            const carts = await this.model.find()

            return carts.map(p => p.toObject())
        } catch (error) {
            throw error
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.model.findById(id)
            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }
            return  cart.toObject()
        } catch (error) {
            throw error
        }
    }

    async addCart() {
        try {
            const newCart = await this.model.create({ product: [] })
            return newCart
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid) {
        
        try {
            const cart = await this.model.findById(cid)
        
            const product = await productModel.findById(pid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart.products.findIndex((p) => p.product === pid);
            const productToAdd = {
                product: product.id,
                quantity: 1
            };

            (existingProductInCart !== -1)
                ? cart.products[existingProductInCart].quantity++
                : cart.products.push(productToAdd);

            cart.markModified('products')
            cart.save()
        } catch (error) {
            throw error
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }
    
            
            const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);
    
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            
            cart.products.splice(productIndex, 1);
    
            
            await cart.save();
        } catch (error) {
            throw error;
        }
    }
    
    async clearCart(cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }
    
            
            cart.products = [];
    
            
            await cart.save();
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = CartManagerMongo






