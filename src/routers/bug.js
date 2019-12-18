const express 	= require('express'),
 	  Bug 		= require ('../models/bug');


const router = new express.Router();


//INDEX
router.get('/bugs', async (req, res) => {
	try {
		const allTasks = await Bug.find({});
		res.status(200).send(allTasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

//SHOW
router.get('/bugs/:id', async (req, res) => {
	try {
		const bug = await Bug.findById(req.params.id);
		if(!bug) return res.status(404).send(bug);
		res.status(200).send(bug)
	} catch (e) {
		res.status(500).send(e);
	}
	
});

//CREATE
router.post('/bugs', async (req, res) => {
	const bug = new Bug(req.body);
	try {
		await bug.save();
		res.status(201).send(bug);
	} catch (e) {
		res.status(400).send(e);
	}
});

//UPDATE
router.patch('/bugs/:id', async (req, res) => {
	const allowedUpdates = ['description', 'resolved'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every( (prop) => allowedUpdates.includes(prop));
	if(!isValidOperation) return res.status(400).send('Invalid updates')
	try {
		const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
		if (!bug) return res.status(404).send();
		res.send(bug);
	} catch (e) {
		res.status(400).send(e);
	}
});

//DELETE
router.delete('/bugs/:id', async (req, res) => {
	try {
		const bug = await Bug.findByIdAndDelete(req.params.id);
		if (!bug) return res.status(404).send();
		res.send(bug);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
