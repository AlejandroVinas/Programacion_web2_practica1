const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  imagen: String,
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Producto', productoSchema);
