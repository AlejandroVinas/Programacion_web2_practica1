const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5000, // Límite de 5 intentos por IP
  message: { 
    error: "Has superado el límite de intentos. Vuelve a intentarlo en 15 minutos." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
