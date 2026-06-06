const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`OrganizaAE API rodando em http://localhost:${env.port}`);
});
