//table for categories
const Sequelize = require('sequelize')
const db = require('../db')


const Click = db.define('click', {
	x  : {
		type     : Sequelize.FLOAT,
		allowNull: false
	},
	y: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	element: {
		type: Sequelize.BIGINT,
		allowNull: false
	},
	top: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	left: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	clientwidth: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	clientheight: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	resized: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	},
	referrer: {
		type: Sequelize.STRING,
		defaultValue: 'http://www.google.com/'
	},
	referrerSubstring:{
		type: Sequelize.STRING,
		defaultValue: 'www.google.com'
	},
	page: {
		type: Sequelize.STRING,
		defaultValue: '/home'
	},
	count: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	}
})


module.exports = Click
