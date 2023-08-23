const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo')
const uploader = require('../utils/uploader')
const productsRouter = new Router()
const productManager = new ProductManagerMongo();



productsRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || '';
    const category = req.query.category || '';
    const availability = req.query.availability || '';

    const filter = {};
    if (category) filter.category = category;
    if (availability) filter.availability = availability;
    if (query) {
        filter.$or = [{ category }, { availability }];
    }

    try {
        const products = await productManager.getProducts(filter, sort, limit, page);

        const totalProducts = await productManager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        const paginationLinks = (baseURL, params) =>
            Object.keys(params)
                .filter(key => params[key] !== undefined)
                .map(key => `${key}=${params[key]}`)
                .length > 0
                ? `${baseURL}?${Object.keys(params)
                    .filter(key => params[key] !== undefined)
                    .map(key => `${key}=${params[key]}`)
                    .join('&')}`
                : null;

        const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: paginationLinks('/products', { limit, page: prevPage, sort, query, category, availability }),
            nextLink: paginationLinks('/products', { limit, page: nextPage, sort, query, category, availability }),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

productsRouter.get('/', async (req, res) => {
    try { const products = await Product.find();
        res. json(products);
    } catch (error) {
    res. status(500).json({ error: 'Error al obtener los productos', message: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductById(pid);
        return res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        const commonErrorMessage = 'Error al obtener el producto';
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});

productsRouter.post('/', uploader.array('thumbnails', 5), async (req, res) => {
    const newProduct = req.body;
    const thumbnails = req.files ? req.files.map(file => file.path) : [];
    try {
        await productManager.addProduct({ ...newProduct, thumbnails });
        return res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
    }
});
productsRouter.post('/', async (req, res) => {
    try {
      
      const formData = req.body;
  
      
      await productManager.addProduct(formData);
  
      res.redirect('/products');
    } catch (error) {
  
    }
  });

productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(pid, updatedProduct);
        return res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al actualizar el producto';
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` });
        }
        if (error.code === 11000) {
            return res.status(404).json({ error: commonErrorMessage, message: `El código ${updatedProduct.code} ya se encuentra en uso` });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        await productManager.deleteProduct(pid);
        return res.status(200).json({ status: 'success', message: 'Producto borrado exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al borrar el producto';
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
});

module.exports = productsRouter;


