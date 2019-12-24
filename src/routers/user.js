const express 	= require('express'),
	  User 		= require('../models/user'),
	  auth 		= require('../middleware/auth');

const router = new express.Router();

//INDEX

router.get('/users', auth, async (req, res) => {
	try {
		console.log('user is:', req.user);
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
	try {
		const user = new User(req.body);
		const token = await user.generateAuthToken();
		res.status(201).send({user, token});
	} catch (e){
		res.status(400).send(e);
	}
	

});

//LOGIN
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({user, token});
	} catch (e){
		res.status(400).send();
	}
});

//UPDATE
router.patch('/users/:id', async (req, res) => {
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every( (prop) => allowedUpdates.includes(prop));
	if(!isValidOperation) return res.status(400).send({ error: 'Invalid Updates'});
	try {
		const user = await User.findById(req.params.id);
		if(!user) return res.status(404).send();
		for (let update of updates) {
			user[update] = req.body[update];
		}
		const newUser = await user.save();
		res.send(newUser);
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