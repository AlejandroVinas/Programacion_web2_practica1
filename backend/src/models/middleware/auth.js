const User = require('../models/User');

function decodeBasicAuth(header) {
  const base64Credentials = header.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  return { username, password };
}

async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Credenciales requeridas' });
  }

  const { username, password } = decodeBasicAuth(authHeader);
  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(403).json({ message: 'Credenciales inválidas' });
  }

  req.user = user;
  next();
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos de administrador' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
