const mongoose 		= require('mongoose'),
	  validator 	= require('validator');	

const commentSchema = new mongoose.Schema({
	text: {
		type: String,
		trim: true,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	bug: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Bug'
	}

}, {
	timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;