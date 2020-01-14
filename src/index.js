const express 		= require('express'),
	  app			= express(),
	  mongoose		= require('mongoose'),
	  userRouter 	= require('./routers/user'),
	  bugRouter		= require('./routers/bug'),
	  commentRouter = require('./routers/comment'),
	  port			= process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true
});

//comfigure app
app.use(express.json()); //parse body as json and provide via req.body
app.use(userRouter);
app.use(bugRouter);
app.use(commentRouter);



app.listen(port, () => console.log(`Server listening on port ${port}`));	

// const main = async () => {
// 	const Bug = require('./models/bug');
// 	const User = require('./models/user');

	// const bug = await Bug.findById('5e079390bc31c98cfc041fa5');
	// await bug.populate('owner').execPopulate();
	// console.log(bug.owner);

	// const user = await User.findById('5e079631b0bf748d579cf8ed');
	// await user.populate('bugs').execPopulate();
	// console.log(user.bugs);

// }

// main();