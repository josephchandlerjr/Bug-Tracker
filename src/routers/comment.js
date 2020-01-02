const express 	= require('express'),
 	  Comment 	= require('../models/comment'),
  	  auth 		= require('../middleware/auth');



const router = new express.Router();


//INDEX
router.get('/comments', auth, async (req, res) => {
	try {
		const allTasks = await Comment.find({});
		res.status(200).send(allTasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

//SHOW
router.get('/comments/:commentId', auth, async (req, res) => {
	try {
		const comment = await Comment.findOne({ 
			_id: req.params.commentId,
			bug: req.params.id,
			owner: req.user._id
		});
		if(!comment) return res.status(404).send();
		res.status(200).send(comment)
	} catch (e) {
		res.status(500).send(e);
	}
	
});

//CREATE
router.post('/comments', auth, async (req, res) => {
	const comment = new Comment({
		...req.body,
		bug: req.params.id,
		owner: req.user._id
	});
	try {
		await comment.save();
		res.status(201).send(comment);
	} catch (e) {
		res.status(400).send(e);
	}
});

//UPDATE
router.patch('/comments/:commentId', auth, async (req, res) => {
	const allowedUpdates = ['text'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every( (prop) => allowedUpdates.includes(prop));
	if(!isValidOperation) return res.status(400).send('Invalid updates')
	try {
		const comment = await Comment.findOne({
			_id: req.params.commentId,
			bug: req.params.id,
			owner: req.user._id
		});
		if (!comment) return res.status(404).send();
		for(let update of updates) {
			comment[update] = req.body[update];
		}
		const newComment = await comment.save();
		res.send(newComment);
	} catch (e) {
		res.status(400).send(e);
	}
});

//DELETE
router.delete('/comments/:commentId', auth, async (req, res) => {
	try {
		const comment = await Comment.findOneAndDelete({
			_id: req.params.commentId,
			bug: req.params.id,
			owner: req.user._id
		});
		if (!comment) return res.status(404).send();
		res.send(comment);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
