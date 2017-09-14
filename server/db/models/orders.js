
const Sequelize = require('sequelize')
const db = require('../db')


const Order = db.define('order', {
	orderDate: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		allowNull: false,
	},
	shipDate: Sequelize.DATE,
	fulfilled: Sequelize.BOOLEAN,
})

module.exports = Order
