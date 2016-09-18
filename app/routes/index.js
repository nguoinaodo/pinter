'use strict';

var Controller = require(process.cwd() + '/app/controllers/controller.server.js');

module.exports = function (app, passport) {
	var controller = new Controller();
	
	app.route('/')
		.get(function(req, res) {
			var auth = req.isAuthenticated();
			
			res.render('home', {
				auth: auth
			});
		});
		
	
	///////////////// authentication
	// twitter
	app.route('/auth/twitter')
		.get(passport.authenticate('twitterLogin'));
	
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitterLogin', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
	// github
	app.route('/auth/github')
		.get(passport.authenticate('githubLogin'));
		
	app.route('/auth/github/callback')
		.get(passport.authenticate('githubLogin', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
	// facebook
	app.route('/auth/facebook')
		.get(passport.authenticate('fbLogin'));
	
	app.route('/auth/facebook/callback')
		.get(passport.authenticate('fbLogin', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
	// logout
	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/');
		});
	
	//////////////////////////// api
	app.route('/api/pics')
		.get(controller.getPics);
	
	app.route('/api/mypics')
		.get(controller.getMyPics);
	
	app.route('/api/users/:userId')
		.get(controller.getUser);
	
	app.route('/api/pics/:picId')
		.post(controller.like)
		.put(controller.unlike)
		.delete(controller.delete);
	
	app.route('/api/addpic')
		.post(controller.addPic);
	
};
