const Producto = require('../models/Producto');
const client = require('../config/redis');

class ProductService {
  async getAllProducts(nameFilter) {
    // 1. Try to get from Redis
    const cachedProducts = await client.get('lista_productos');
    let products;

    if (cachedProducts) {
      console.log('Sirviendo desde caché (Redis) ⚡️');
      products = JSON.parse(cachedProducts);
    } else {
      console.log('Consultando MongoDB 🐢');
      products = await Producto.find();
      await client.set('lista_productos', JSON.stringify(products), { EX: 60 });
    }

    if (nameFilter) {
      const searchName = nameFilter.toLowerCase();
      products = products.filter(p => p.nombre.toLowerCase().includes(searchName));
    }

    return products;
  }

  async createProduct(data) {
    const producto = new Producto(data);
    await producto.save();
    await client.del('lista_productos');
    return producto;
  }

  async updateProduct(id, data) {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    await client.del('lista_productos');
    return producto;
  }

  async deleteProduct(id) {
    await Producto.findByIdAndDelete(id);
    await client.del('lista_productos');
  }
}

module.exports = new ProductService();
