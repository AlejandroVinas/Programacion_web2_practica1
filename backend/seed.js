const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
// Fix: Adjust path if running from root or backend folder
const User = require("./src/models/User"); 

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/productos";

console.log("Conectando a MongoDB para el seed:", mongoUri);

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado para seed'))
  .catch(err => {
      console.error('Error conectando a MongoDB:', err);
      process.exit(1);
  });

async function seed() {
  try {
    // Check if users already exist
    const count = await User.countDocuments();
    if (count > 0) {
      console.log("La base de datos ya tiene usuarios. Saltando seed.");
      process.exit(0);
    }

    console.log("Limpiando usuarios antiguos (si los hay)...");
    await User.deleteMany({});
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await User.create([
      { username: "admin", password: adminPassword, role: "admin" },
      { username: "user", password: userPassword, role: "user" },
    ]);
    console.log("Usuarios iniciales creados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seed();