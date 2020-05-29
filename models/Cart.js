const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    secretKey:{
        type: String,
        required: true
    },
	productId:{
        type: String,
        required: true
    },
    variantId:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;