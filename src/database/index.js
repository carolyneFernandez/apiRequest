'use strict';
const path = require('path');
const Sequelize = require('sequelize');
var faker = require('faker');

const url = (process.env.DATABASE_URL || '').match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
const DB_name     = url ? url[6] : null;
const user        = url ? url[2] : null;
const pwd         = url ? url[3] : null;
const protocol    = url ? url[1] : null;
const dialect     = url ? url[1] : 'sqlite';
const port        = url ? url[5] : null;
const host        = url ? url[4] : null;

// Here we verify the environmental variable to know if we're on test, development or production
const storage     = process.env.DATABASE_STORAGE || 'database.sqlite';

const sequelize = new Sequelize(DB_name, user, pwd, {
	dialect,
	protocol,
	port,
	host,
	storage,
	omitNull: true,
	logging: process.env.NODE_ENV !== 'test'
});

// TODO: Add here all your mapped models of your database
const Users = sequelize.import(path.join(__dirname, 'users'));
const Flights = sequelize.import(path.join(__dirname, 'flights'));
const Booking = sequelize.import(path.join(__dirname, 'booking'));

sequelize.sync()
	.then(() => {
		Flights.create({
			flightNumber: faker.random.number(),
			company: faker. company.companyName(),
			departure: faker.address.city(),
			destination: faker.address.city(),
			date: String(faker.date.future()),
			status: 'NO STATUS'
		})
		Booking.create({
			bookingNumber: faker.random.number(),
			seatNumber: faker.random.number(),
			class: faker.random.number(),
			flight: faker.random.number(),
			passengerName: faker.name.findName(),
		})
	})
;

// TODO: And export them
exports.Users = Users;
exports.Flights = Flights;
exports.Booking = Booking;

// Exporting sequelize object to allow raw queries if needed
exports.sequelize = sequelize;