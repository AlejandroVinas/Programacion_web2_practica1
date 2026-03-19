const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); 

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// Serve static files from root uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount routes at /api
app.use('/api', routes);

module.exports = app;
