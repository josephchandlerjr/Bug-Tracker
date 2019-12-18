const mongoose 		= require('mongoose'),
	  validator 	= require('validator');	

const Bug = mongoose.model('Task', {
	description: {
		type: String,
		trim: true,
		required: true
	},
	resolved: {
		type: Boolean,
		default: false
	}
});

module.exports = Bug;