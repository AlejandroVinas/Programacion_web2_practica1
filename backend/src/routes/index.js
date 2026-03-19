const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const userRoutes = require('./userRoutes');

router.use('/', authRoutes); // /api/login, /api/register are at root of api in original
// Wait, original was /api/login. So if I mount this at /api, it becomes /api/login.
// But wait, the original routes.js had /api/login directly.
// In app.js I will likely mount this router at /api.
// So authRoutes should be just /login and /register.

router.use('/productos', productRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

// SEO Route (Sitemap) - keeping it here or moving to a controller?
// For simplicity, let's keep it here or create a SeoController.
// Let's keep it simple and inline it or move to utils if needed.
// Actually, let's just add it here for now to match functionality.
const Producto = require('../models/Producto');
router.get('/sitemap.xml', async (req, res) => {
  try {
    const productos = await Producto.find();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://mi-tienda.com/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;

    productos.forEach(prod => {
      xml += `
      <url>
        <loc>https://mi-tienda.com/producto/${prod._id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).end();
  }
});

module.exports = router;
