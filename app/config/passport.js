'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	// github login 
	passport.use('githubLogin', new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.photo = profile.photos[0].value;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
	// twitter login
	passport.use('twitterLogin', new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	}, function(token, tokenSecret, profile, done) {
		var findOrCreateUser = function() {
			User
				.findOne({'twitter.id': profile.id})
				.exec(function(err, user) {
					if (err) 
						return done(err);
					
					if (user) 
						return done(null, user);
					else {
						var newUser = new User();
						
						newUser.twitter.id = profile.id;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.twitter.photo = profile.photos[0].value;
						
						newUser.save(function(err) {
							if (err) throw err;
							
							return done(null, newUser);
						});
					}
				});
		};
		
		process.nextTick(findOrCreateUser);
	}));
	// facebook login
	passport.use('fbLogin', new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		var findOrCreateUser = function() {
			User
				.findOne({'facebook.id': profile.id})
				.exec(function(err, user) {
					if (err)
						return done(err);
					
					if (user)
						return done(null, user);
					else {
						var newUser = new User();
						
						newUser.facebook.id = profile.id;
						newUser.facebook.username = profile.username;
						newUser.facebook.displayName = profile.displayName;
						newUser.facebook.photo = profile.photos[0].value;
						
						newUser.save(function(err) {
							if (err) throw err;
							
							return done(null, newUser);
						});
					}
				});
		};
		
		process.nextTick(findOrCreateUser);
	}));
};
