const mongoose 		= require('mongoose'),
	  validator 	= require('validator');	

const Bug = mongoose.model('Bug', {
	description: {
		type: String,
		trim: true,
		required: true
	},
	workaround: {
		type: String,
		trim: true,
		default: 'N/A'
	},
	severity: {
		type: Number,
		validate(value){
			if (value < 1 || value > 5) throw new Error('Severity must be a number between 1 and 5');
		},
		required: true
	},
	resolved: {
		type: Boolean,
		default: false
	}
});

module.exports = Bug;