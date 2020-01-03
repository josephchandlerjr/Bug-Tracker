const mongoose 		= require('mongoose'),
	  validator 	= require('validator');	

const bugSchema = new mongoose.Schema({
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
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;