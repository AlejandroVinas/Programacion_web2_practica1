const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      await AuthService.register(username, password);
      res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (err) {
      console.error("❌ Error al registrar usuario:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const token = await AuthService.login(username, password);
      
      if (!token) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

module.exports = new AuthController();
