const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const authJWT = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestión del carrito de compras
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/', authJWT, CartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Añadir producto al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto añadido
 *       500:
 *         description: Error del servidor
 */
router.post('/add', authJWT, CartController.addToCart);

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Eliminar producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:productId', authJWT, CartController.removeFromCart);

module.exports = router;
