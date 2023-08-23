const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product' 
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});

module.exports = mongoose.model('Cart', cartSchema);

