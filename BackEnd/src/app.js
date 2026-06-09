const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const openapi = require('./docs/openapi');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'OrganizaAE API' });
});

app.get('/openapi.json', (req, res) => res.json(openapi));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapi, {
    customSiteTitle: 'OrganizaAE API',
    swaggerOptions: { persistAuthorization: true },
  })
);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
