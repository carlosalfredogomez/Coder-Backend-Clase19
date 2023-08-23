const fs = require("fs");

class CartManager {

    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async createCart() {
        try {
            await this.createCart()
            const newCart = {
                id: this.carts.length + 1,
                products: [],
            };

            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

        } catch (error) {
            console.log('No se agrego al carrito');
            throw error;
        }

    }

    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
                console.log(`El archivo ${this.path} fue creado correctamente`);
                return []
            }
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            console.log("Error al leer o parsear el archivo", { error });
            this.carts = [];
            return this.carts;
        }
    }

    async getCartById(id) {
        try {
            await this.createCart()
            const cart = this.carts.find((cart) => cart.id === id);
            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }
            return cart
        } catch (error) {
            console.log('Error al obtener el carrito')
            throw error
        }
    }

    
    async loadInventory() {
        try {
            const productsData = await fs.promises.readFile('../../Data/product.json', 'utf-8')
            const products = JSON.parse(productsData)
            return products
        } catch (error) {
            console.log('Error al obtener los productos del inventario')
            throw error
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            await this.createCart(); 
            const products = await this.loadInventory();
            const product = products.find((p) => p.id === productId);
    
            if (!product) {
                throw new Error(`No figura en nuestro inventario ese producto`);
            }
    
            const productToAdd = {
                product: product.id,
                quantity: 1
            };
    
            const existingProductInCart = cart.products.findIndex(p => p.product === productId);
            
            if (existingProductInCart !== -1) {
                cart.products[existingProductInCart].quantity++;
            } else {
                cart.products.push(productToAdd);
            }
    
            cart.products.sort((a, b) => a.product - b.product);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log('Error al guardar el producto en el carrito');
            throw error;
        }
    }
    
}
module.exports = CartManager