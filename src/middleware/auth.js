const User 	= require('../models/user'),
	  jwt 	= require('jsonwebtoken');

//grabs bearer token, decodes it, finds user with that token, and set user and token properties on request object
const auth = async (req, res, next) => {
	try {
		const token = req.header('authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'supersecretsecret');
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if(!user) throw new Error();

		req.user = user;
		req.token = token;
		
		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate' });
	}
	
}

module.exports = auth;