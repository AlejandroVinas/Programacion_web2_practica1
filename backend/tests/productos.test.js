const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../server');
const User = require('../models/User');
const Producto = require('../models/Producto');

let adminToken;
let userToken;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/productos_test';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Producto.deleteMany({});
  await User.create({ username: 'admin', password: await bcrypt.hash('1234', 10), role: 'admin' });
  await User.create({ username: 'pepe', password: await bcrypt.hash('1234', 10), role: 'user' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Autenticación básica y productos', () => {
  it('Admin puede hacer login y obtener un token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  it('Usuario normal puede hacer login y obtener un token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'pepe', password: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  it('Usuario normal puede consultar productos', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Usuario normal NO puede añadir productos', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Zapato', precio: 29.99 });
    expect(res.statusCode).toBe(403);
  });

  it('Admin puede añadir productos', async () => {
    const res = await request(app) 
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Camisa', precio: 19.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nombre', 'Camisa');
  });

  it('Petición sin token debe ser rechazada', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(401);
  });

  it('Admin puede eliminar productos', async () => {
    const producto = await Producto.create({ nombre: 'Pantalón', precio: 39.99 });
    const res = await request(app)
      .delete(`/api/productos/${producto._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Producto eliminado');
  });
});
