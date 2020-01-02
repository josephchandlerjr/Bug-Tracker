const express 	= require('express'),
 	  Bug 		= require('../models/bug'),
  	  auth 		= require('../middleware/auth');



const router = new express.Router();


//INDEX
router.get('/bugs', auth, async (req, res) => {
	try {
		const allTasks = await Bug.find({});
		res.status(200).send(allTasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

//SHOW
router.get('/bugs/:id', auth, async (req, res) => {
	try {
		const bug = await Bug.findById(req.params.id);
		if(!bug) return res.status(404).send(bug);
		res.status(200).send(bug)
	} catch (e) {
		res.status(500).send(e);
	}
	
});

//CREATE
router.post('/bugs', auth, async (req, res) => {
	const bug = new Bug({
		...req.body,
		owner: req.user._id
	});
	try {
		await bug.save();
		res.status(201).send(bug);
	} catch (e) {
		res.status(400).send(e);
	}
});

//UPDATE
router.patch('/bugs/:id', auth, async (req, res) => {
	const allowedUpdates = ['description', 'resolved', 'workaround', 'severity'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every( (prop) => allowedUpdates.includes(prop));
	if(!isValidOperation) return res.status(400).send('Invalid updates')
	try {
		const bug = await Bug.findOne({
			_id: req.params.id,
			owner: req.user._id
		});
		if (!bug) return res.status(404).send();
		for(let update of updates) {
			bug[update] = req.body[update];
		}
		const newBug = await bug.save();
		res.send(newBug);
	} catch (e) {
		res.status(400).send(e);
	}
});

//DELETE
router.delete('/bugs/:id', auth, async (req, res) => {
	try {
		const bug = await Bug.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id
		});
		if (!bug) return res.status(404).send();
		res.send(bug);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
