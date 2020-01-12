[![Build Status](https://travis-ci.org/CoorpAcademy/swagger-ui-express.svg?branch=master)](https://travis-ci.org/CoorpAcademy/swagger-ui-express) [![codecov](https://codecov.io/gh/CoorpAcademy/swagger-ui-express/branch/master/graph/badge.svg)](https://codecov.io/gh/CoorpAcademy/swagger-ui-express)



# Swagger-ui-middleware

```javascript
const express = require('express');
const createSwaggerUiMiddleware = require('@coorpacademy/swagger-ui-express');

const app = express();

app.use(
  createSwaggerUiMiddleware({
    swaggerDoc: require('./swagger.json'),
    apiDocs: '/api-docs',
    swaggerUi: '/explorer',
    indexPath: 'index.html'
  })
);

app.listen(8000);
```

Open [http://localhost:8000/explorer](`http://localhost:8000/explorer`)
