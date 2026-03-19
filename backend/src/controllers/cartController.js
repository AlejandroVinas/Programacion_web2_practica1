const CartService = require('../services/cartService');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await CartService.getCart(req.user.id);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const cart = await CartService.addToCart(req.user.id, productId);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al añadir al carrito' });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      const cart = await CartService.removeFromCart(req.user.id, productId);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
  }
}

module.exports = new CartController();
