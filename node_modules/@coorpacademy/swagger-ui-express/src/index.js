const {promisify} = require('util');
const {parse} = require('url');
const {join} = require('path');
const {readFile} = require('fs');
const {Router} = require('express');
const SwaggerUiDir = require('swagger-ui-dist');
const serveStatic = require('serve-static');

const readFileP = promisify(readFile);

module.exports = ({
  swaggerDoc,
  apiDocs = '/api-docs',
  swaggerUiDir = SwaggerUiDir.absolutePath(),
  swaggerUi = '/explorer',
  indexPath = join(__dirname, '../public/index.html')
} = {}) => {
  const router = new Router();
  const staticSwaggerUi = serveStatic(swaggerUiDir);
  const staticPublic = serveStatic(join(__dirname, '../public/'));
  const indexP = readFileP(indexPath, {encoding: 'UTF8'});

  router.use((req, res, next) => {
    if (req.path === swaggerUi) {
      return res.redirect(`${swaggerUi}/${parse(req.url).search || ''}`);
    }
    next();
  });

  router.get(apiDocs, (req, res) => {
    res.json(swaggerDoc);
  });

  router.use(
    swaggerUi,
    (req, res, next) => {
      res.setHeader('Swagger-API-Docs-URL', apiDocs);
      next();
    },
    (req, res, next) => {
      if (req.path !== '/') {
        return next();
      }

      return indexP.then(file => res.send(file)).catch(next);
    },
    staticSwaggerUi,
    staticPublic
  );

  return router;
};
