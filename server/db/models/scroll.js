//table for categories
const Sequelize = require('sequelize')
const db = require('../db')


const Scroll = db.define('scroll', {
	y  : {
		type     : Sequelize.INTEGER,
		allowNull: false
	},
	count: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 1
	},
})

module.exports = Scroll
