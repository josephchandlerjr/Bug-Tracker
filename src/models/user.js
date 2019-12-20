const mongoose 		= require('mongoose'),
	  validator 	= require('validator'),
	  bcrypt		= require('bcryptjs');



const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if(value < 0) throw new Error('Age must be a positive number');

		}
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) throw new Error('You must provide a valid email address');
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		validate(value){
			if (validator.contains(value.toLowerCase(), 'password')) throw new Error("'password'? really?!");
		},
		trim: true
	}
});

// middleware
userSchema.pre('save', async function(next){ // must use normal function def to get this binding
	const user = this;
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;


