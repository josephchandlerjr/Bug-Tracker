const mongoose 		= require('mongoose'),
	  validator 	= require('validator');	

const Comment = mongoose.model('Comment', {
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

});

module.exports = Comment;