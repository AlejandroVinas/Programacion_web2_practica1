const dotenv = require('dotenv');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const client = require('./src/config/redis');

dotenv.config();

async function startServer() {
  // Conectar Redis
  await client.connect();

  // Conectar MongoDB
  await connectDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}

if (require.main === module) {
  startServer();
}

/*const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
async function seed() {
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await User.create([
    { username: "admin", password: adminPassword, role: "admin" },
    { username: "user", password: userPassword, role: "user" },
  ]);
  console.log("Usuarios iniciales creados");
}

seed();*/


module.exports = app;
