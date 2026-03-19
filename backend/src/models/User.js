const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
role: { type: String, enum: ['admin', 'user'], default: 'user' },
cart: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    quantity: { type: Number, default: 1 }
  }
]
});
module.exports = mongoose.model('User', userSchema);
