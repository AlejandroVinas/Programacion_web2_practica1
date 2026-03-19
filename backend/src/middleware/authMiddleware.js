const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    jwt.verify(token, process.env.JWT_SECRET, async (err, userPayload) => {
      if (err) {
        return res.sendStatus(403); // Token inválido o expirado
      }
      // Adjuntamos el usuario al request para usarlo en las rutas protegidas
      req.user = await User.findById(userPayload.id);
      next();
    });
  } else {
    res.sendStatus(401); // No hay token
  }
}

module.exports = authJWT;
