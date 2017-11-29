const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Pw = db.define('pw', {
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

module.exports = Pw


