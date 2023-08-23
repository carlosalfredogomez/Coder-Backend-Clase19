const productModel = require('./models/productModel');


class ProductManagerMongo {
    constructor(io) {
        this.model = productModel;
        this.io = io;
    }

    async getProducts(filter = {}, sort = null, limit = 10, page = 1) {
        try {
            const skip = (page - 1) * limit;
            const products = await this.model.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            return products.map(p => p.toObject());
        } catch (error) {
            throw error;
        }
    }

    async countProducts(filter = {}) {
        try {
            const count = await this.model.countDocuments(filter);
            return count;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.model.findById(pid);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product.toObject();
        } catch (error) {
            throw error;
        }
    }

    async addProduct(data) {
        try {
            if (
                !data.title ||
                !data.description ||
                !data.code ||
                !data.price ||
                data.status === undefined ||
                data.status === null ||
                data.status === '' ||
                !data.stock ||
                !data.category
            ) {
                throw new Error('Todos los campos son obligatorios');
            }

            const exist = await this.model.findOne({ code: data.code });

            if (exist) {
                throw new Error(`Ya existe un producto con el código '${data.code}'`);
            }

            const newProduct = await this.model.create({
                title: data.title,
                description: data.description,
                code: data.code,
                price: data.price,
                status: data.status,
                stock: data.stock,
                category: data.category,
                thumbnails: data.thumbnails,
            });

            if (this.io) {
                this.io.emit('newProduct', JSON.stringify(newProduct));
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, data) {
        try {
            const product = await this.getProductById(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const productUpdated = {
                ...product,
                ...data,
            };

            await this.model.updateOne({ _id: id }, productUpdated);

            if (this.io) {
                this.io.emit('updateProductInView', JSON.stringify(productUpdated));
            }

            return productUpdated;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.getProductById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await this.model.deleteOne({ _id: id });
            if (this.io) {
                this.io.emit('productDeleted', id);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManagerMongo;

