const express 	= require('express'),
	  User 		= require('../models/user');

const router = new express.Router();

//INDEX

router.get('/users', async (req, res) => {
	try {
		const allUsers = await User.find({});
		res.status(200).send(allUsers);
	} catch (e) {
		res.status(500).send(e);
	}
	
});

//SHOW
router.get('/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if(!user) return res.status(404).send();
		res.status(200).send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

//CREATE
router.post('/users', async (req, res) => {
	const user = new User(req.body);	
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e){
		res.status(400).send(e);
	}
	

});

//UPDATE
router.patch('/users/:id', async (req, res) => {
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every( (prop) => allowedUpdates.includes(prop));
	if(!isValidOperation) return res.status(400).send({ error: 'Invalid Updates'});
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
		if(!user) return res.status(404).send();
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//DELETE
router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).send();
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;