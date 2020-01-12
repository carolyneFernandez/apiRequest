const {promisify} = require('util');
const {join} = require('path');
const {readFile} = require('fs');
const test = require('ava');
const App = require('express');
const request = require('supertest');
const createSwaggerUIMiddleware = require('..');
const swaggerDoc = require('./fixtures/swagger');

const readFileP = promisify(readFile);

test('should return express router', async t => {
  const app = new App();

  app.use(createSwaggerUIMiddleware());
  app.get('/', (req, res) => {
    res.send('Hello');
  });

  const response = await request(app).get('/');

  t.is(response.text, 'Hello');
});

test('should return swagger definition', async t => {
  const app = new App();

  app.use(
    createSwaggerUIMiddleware({
      swaggerDoc
    })
  );

  const response = await request(app).get('/api-docs');

  t.deepEqual(response.body, swaggerDoc);
});

test('should allow to override swagger definition endpoint', async t => {
  const app = new App();

  app.use(
    createSwaggerUIMiddleware({
      swaggerDoc,
      apiDocs: '/swagger-docs'
    })
  );

  const response = await request(app).get('/swagger-docs');

  t.deepEqual(response.body, swaggerDoc);
});

test('should serve swaggerUi', async t => {
  const app = new App();

  app.use(createSwaggerUIMiddleware({}));

  t.is((await request(app).get('/explorer/')).type, 'text/html');
  t.is((await request(app).get('/explorer/swagger-ui.css')).type, 'text/css');
  t.is((await request(app).get('/explorer/swagger-ui-bundle.js')).type, 'application/javascript');
});

test('should allow to override swaggerUi endpoint', async t => {
  const app = new App();

  app.use(
    createSwaggerUIMiddleware({
      swaggerUi: '/swagger'
    })
  );

  const response = await request(app).get('/swagger/');

  t.is(response.type, 'text/html');
});

test('should allow to override index.html', async t => {
  const app = new App();
  const indexPath = join(__dirname, 'fixtures/index.html');

  app.use(
    createSwaggerUIMiddleware({
      indexPath
    })
  );

  const response = await request(app).get('/explorer/');

  t.is(response.text, await readFileP(indexPath, {encoding: 'UTF8'}));
});

test('should add Swagger-API-Docs-URL header', async t => {
  const app = new App();

  app.use(createSwaggerUIMiddleware());

  const response = await request(app).get('/explorer/');

  t.is(response.headers['swagger-api-docs-url'], '/api-docs');
});

test('should redirect /explorer to /explorer/', async t => {
  const app = new App();

  app.use(createSwaggerUIMiddleware());

  const response = await request(app).get('/explorer');
  t.is(response.status, 302);
  t.is(response.headers.location, '/explorer/');

  const responseWithQuery = await request(app).get('/explorer?foo');
  t.is(responseWithQuery.status, 302);
  t.is(responseWithQuery.headers.location, '/explorer/?foo');
});
