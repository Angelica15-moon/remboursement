const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/login', // L'URL de votre API
    createProxyMiddleware({
      target: 'http://localhost:3001', // Adresse du serveur API local
      changeOrigin: true,
    })
  );
};
