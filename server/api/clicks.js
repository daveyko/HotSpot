const router = require('express').Router()
const {Click} = require('../db/models')
var Sequelize = require('sequelize')
const sequelize = new Sequelize(
	process.env.DATABASE_URL, {
		logging: false
	}
)

module.exports = router

router.get('/popularSites', (req, res, next) => {
	Click.findAll({
		attributes: [
			[sequelize.fn('SUM', sequelize.col('count')), 'total'],
			'referrerSubstring'],
		group: ['referrerSubstring'],
		order: [
			[sequelize.fn('SUM', sequelize.col('count')), 'DESC']
		]
	})
		.then((results) => {
			res.json(results)
		})
})

router.get('/:url', (req, res, next) => {
	Click.findAll({
		where: {
			referrerSubstring: req.params.url
		}
	})
		.then((results) => {
			res.json(results)
		})
})

router.post('/', (req, res, next) => {
	Click.findOrCreate({
		where: {
			x: req.body.x,
			y: req.body.y,
			element: req.body.element,
			top: req.body.top,
			left: req.body.left,
			clientwidth: req.body.clientwidth,
			clientheight: req.body.clientheight,
			resized: req.body.resized
		},
		defaults: {
			referrer: req.body.referrer,
			page: req.body.path
		}}
	)
		.spread((clickInstance, created) =>{
			if (!created){
				clickInstance.update({count: sequelize.literal('count + 1')})
			}
		}
		)
		.then((result) => {
			res.json(result)
		})
})


router.get('/', (req, res, next) => {
	Click.findAll()
		.then((clicks) => {
			res.json(clicks)
		})
		.catch(next)
})





