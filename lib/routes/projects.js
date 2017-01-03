const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Project = require('../models/project');

router
	//get all
	.get('/', (req, res, next) => {
  	Project.find().lean()
			.then(projects => res.send(projects))
			.catch(next);
})

	//delete by id
	.delete('/:id', (req, res, next) => {
  	Project.findByIdAndRemove(req.params.id)
			.then(deleted => res.send(deleted ))
			.catch(next);
})
		
	//post new project
	.post('/', bodyParser, (req, res, next) => {
  	new Project(req.body).save()
			.then(saved => res.send(saved))
			.catch(next);
})

	//edit by id
	.put('/:id', bodyParser, (req, res, next) => {
  	Project.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
});

module.exports = router;