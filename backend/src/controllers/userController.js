const UserService = require('../services/userService');

class UserController {
  async getUsers(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  async createUser(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      const user = await UserService.createUser(req.body);
      res.status(201).json({ message: "Usuario creado con éxito", user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}

module.exports = new UserController();
