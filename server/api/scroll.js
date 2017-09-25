const router = require('express').Router()
const {Scroll} = require('../db/models')
var Sequelize = require('sequelize')
const sequelize = new Sequelize(
	process.env.DATABASE_URL, {
		logging: false
	}
)

module.exports = router


router.post('/', (req, res, next) => {
	Scroll.findOrCreate({
		where: {
			y: req.body.y
		}
	}
	)
		.spread((scrollInstance, created) =>{
			if (!created){
				scrollInstance.update({count: sequelize.literal('count + 1')})
			}
		}
		)
		.then((result) => {
			res.json(result)
		})
})

router.get('/', (req, res, next) => {
	Scroll.findAll()
		.then((result) => {
			res.json(result)
		})
})
