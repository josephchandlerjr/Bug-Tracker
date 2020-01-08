const express 	= require('express'),
 	  Bug 		= require('../models/bug'),
  	  auth 		= require('../middleware/auth'),
  	  multer	= require('multer'),
  	  mime		= require('mime-types');

const router = new express.Router();

const upload = multer({
	limits: {
		fileSize: 5000000
	},
	fileFilter: (req, file, cb) => {
		if(!file.originalname.match(/\.(jpg|jpeg|png|doc|docx)$/)) {
			cb(new Error('Please upload an image or Word file (jpg, jpeg, png, doc, or docx)'));
		}
		cb(undefined, true);
	}
});


//INDEX
// GET /bugs?resolved=true
// GET /bugs?skip=0
// GET /bugs?limit=10
// GET /bugs?sortBy=completed:desc
router.get('/bugs', auth, async (req, res) => {
	const match = {}
	const sort = {}

	if(req.query.resolved) {
		match.resolved = resolved;
	}

	if(req.query.sortBy){
		const sortBy = req.query.sortBy.split(":");
		sort[sortBy[0]] = sortBy[1] === 'desc' ? -1 : 1;
	}
	

	const limit = parseInt(req.query.limit);
	const skip = parseInt(req.query.skip);


	
	try {
		const allTasks = await Bug.find(match).limit(limit).skip(skip).sort(sort);
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

//UPLOAD file 
router.post('/bugs/:id/file', auth, upload.single('file'), async (req, res) => {
	const bug = await Bug.findById(req.params.id);
	bug.files = bug.files.concat( {
		file: req.file.buffer,
		type: mime.lookup(req.file.originalname),
		owner: req.user._id
	})
	await bug.save();
	res.send();
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message})
});

//DELETE file 
router.delete('/bugs/:id/file/:fileId', auth, upload.single('file'), async (req, res) => {
	const bug = await Bug.findById(req.params.id);
	bug.files = bug.files.filter( f => f._id != req.params.fileId);
	await bug.save();
	res.send();
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message})
});

module.exports = router;
