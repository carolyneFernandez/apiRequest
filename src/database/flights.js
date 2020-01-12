'use strict';

const Flights = (sequelize, DataTypes) => {
	return sequelize.define('Flights', {
		flightNumber: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing flightNumber'}},
			allowNull: false
		},
		departure: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing departure'}},
			allowNull: false
		},
		company: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing company'}},
			allowNull: false
		},
		destination: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing destination'}},
			allowNull: false
		},
		company: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: '-> Missing company'}},
            allowNull: false
        },
		date: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing date'}},
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		}
	});
};

module.exports = Flights;