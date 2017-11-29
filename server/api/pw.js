const router = require('express').Router()
const {Pw} = require('../db/models')

module.exports = router

router.post('/', (req, res, next) => {
	Pw.create(req.body)
		.then(pw => {
			if (pw) res.status(201).json(pw)
			else res.sendStatus(404)
		})
		.catch(next)
})

router.get('/:pw', (req, res, next) => {
	Pw.findOne({
		where: {
			pw: req.params.pw
		}
	})
		.then(pw => res.json(pw))
		.catch(console.log)
})
