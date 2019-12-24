const User 	= require('../models/user'),
	  jwt 	= require('jsonwebtoken');


const auth = async (req, res, next) => {
	try {
		const token = req.header('authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'supersecretsecret');
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if(!user) throw new Error();

		req.user = user;
		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate' });
	}
	
}

module.exports = auth;