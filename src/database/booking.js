'use strict';

const Booking = (sequelize, DataTypes) => {
	return sequelize.define('Booking', {
		bookingNumber: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing bookingNumber'}},
			allowNull: false
		},
		seatNumber: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing seatNumber'}},
			allowNull: false
		},
		class: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing class'}},
			allowNull: false
		},
		flight: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing flight'}},
			allowNull: false
		},
		passengerName: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing PassengerName'}},
			allowNull: false
		}
	});
};

module.exports = Booking;