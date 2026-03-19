const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await User.find({}, '-password');
  }

  async createUser(data) {
    const { username, password, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();
    return { username, role };
  }

  async updateUser(id, data) {
    const { username, role, password } = data;
    const updateData = { username, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    return user;
  }

  async deleteUser(id) {
    await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
