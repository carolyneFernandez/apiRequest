const fs = require('fs');
const jsyaml = require('js-yaml');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const createSwaggerUiMiddleware = require('@coorpacademy/swagger-ui-express');
const database = require('./src/database');

// TODO: require here your routes files
const usersRouter = require('./routes/users');
const flightsRouter = require('./routes/flights');
const bookingRouter = require('./routes/booking');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const spec = fs.readFileSync(path.resolve(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

app.use(
	createSwaggerUiMiddleware({
		swaggerDoc,
		swaggerUi: '/explorer'
	})
);

// Custom middleware to center the database model
app.use(function(req, res, next) {
	req.db = database;
	next();	// On any middleware, next should be called to avoid the timeout error and go to the next middleware!
});

// GET /bookings

// TODO: Add here your routes
app.use('/users', usersRouter);
app.use('/flights', flightsRouter);
app.use('/booking', bookingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

	const format = req.get('accept');

	if (req.accepts('html')) {
		return res.render('error');
	}
	return res.send({
		message: err.message,
		stack: err.stack
	});
});

module.exports = app;