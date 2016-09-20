'use strict';

var Users = require('../models/users');
var Images = require('../models/images');

var Controller = function() {
    this.getPics = function(req, res) {
        var auth = req.isAuthenticated();
        
        
        Images
            .find({})
            .exec(function(err, pics) {
                if (err) throw err;
                
                var status = []; 
                if (auth) {
                    var myId = req.user._id;
                    
                    pics.forEach(function(pic) {
                        status.push({
                            liked: (pic.likers.indexOf(myId) !== -1),
                            isMyOwn: (pic.owner_id == myId)
                        }); 
                    });
                }
                
                res.json({
                    pics: pics,
                    auth: auth,
                    status: status
                });
            });
    };
    
    this.getMyPics = function(req, res) {
        var auth = req.isAuthenticated();
        
        if (auth) {
            var myId = req.user._id;
            
            Users
                .findById(myId, function(err, user) {
                    if (err) throw err;
                    
                    var pics = [];
                    var status = [];
                    var count = 0;
                    var n = user.imageIds.length;
                    
                    user.imageIds.forEach(function(id, i) {
                        Images.findById(id, function(err, pic) {
                            if (err) throw err;
                            
                            pics[i] = pic;
                            status[i] = {};
                            status[i].liked = pic.likers.indexOf(myId) !== -1;
                            status[i].isMyOwn = true;
                            count++;
                            if (count === n)
                                res.json({
                                    pics: pics,
                                    status: status
                                });
                        });
                    }); 
                });
        } else {
            res.redirect('/');
        }
    };
    
    this.getUser = function(req, res) {
        var auth = req.isAuthenticated();
        var userId = req.params.userId;
        
        
        Users   
            .findById(userId, function(err, user) {
                if (err) throw err;
                
                var pics = [];
                var status = [];
                var count = 0;
                var n = user.imageIds.length;
                
                var isMyOwn, myId;
                if (auth) {
                    myId = req.user._id;
                    isMyOwn = (req.user._id == userId);
                }
                user.imageIds.forEach(function(id, i) {
                    Images.findById(id, function(err, pic) {
                        if (err) throw err;
                        
                        pics[i] = pic;
                        if (auth) {
                            status[i] = {};
                            status[i].liked = (pic.likers.indexOf(myId) !== -1);
                            status[i].isMyOwn = isMyOwn;
                        }
                         
                        count++;
                        if (count === n)
                            res.json({
                                auth: auth,
                                pics: pics,
                                status: status
                            });
                    });
                });
            });
    };
    
    this.like = function(req, res) {
        var auth = req.isAuthenticated();
        
        var userId = req.user._id;
        var picId = req.params.picId;
        
        Images.findById(picId, function(err, pic) {
            if (err) throw err;
            
            pic.likers.push(userId);
            pic.save(function(err, result) {
                if (err) throw err;
                
                res.json({likers: result.likers}); 
            });
        });
    };
    
    this.unlike = function(req, res) {
        var auth = req.isAuthenticated();
        
        var userId = req.user._id,
            picId = req.params.picId;
        
        Images.findById(picId, function(err, pic) {
            if (err) throw err;
            
            var ids = pic.likers;
            
            pic.likers = [];
            ids.forEach(function(item) {
                if (item != userId)
                    pic.likers.push(item);
            });
            
            pic.save(function(err, result) {
                if (err) throw err;
                
                res.json({likers: result.likers}); 
            });
        });
    };
    
    this.delete = function(req, res) {
        var auth = req.isAuthenticated();
        
        if (auth) {
            var picId = req.params.picId;
            var myId = req.user._id;
            
            Images.remove({_id: picId}, function(err) {
                if (err) throw err;
                
                Users
                    .findById(myId, function(err, user) {
                        if (err) throw err;
                        
                        var imageIds = user.imageIds;
                        
                        user.imageIds = [];
                        imageIds.forEach(function(id) {
                            if (id != picId)
                                user.imageIds.push(id);
                        });
                        user.save(function(err) {
                            if (err) throw err;
                            
                            res.json({});
                        });
                    });
            });    
        } else {
            res.redirect('/');
        }
    };
    
    this.addPic = function(req, res) {
        var auth = req.isAuthenticated();
        
        if (auth) {
            var imageLink = req.body.link,
                caption = req.body.caption,
                userId = req.user._id;
                
            var newImage = new Images();
            
            
            newImage.imageLink = imageLink;
            newImage.likers = [];
            newImage.owner_id = userId;
            newImage.caption = caption;
            newImage.save(function(err) {
                if (err) throw err;
                
                Users.findById(userId, function(err, user) {
                    if (err) throw err;
                    
                    user.imageIds.push(newImage._id);
                    user.save(function(err) {
                        if (err) throw err;
                        
                        var strategy = user.facebook.id !== undefined? 'facebook': (user.twitter.id !== undefined? 'twitter': 'github');
                        
                        newImage.strategy = strategy;
                        newImage.ownerUsername = user[strategy].username;
                        newImage.ownerPhoto = user[strategy].photo;
                        
                        newImage.save(function(err, result) {
                            if (err) throw err;
                            
                            res.json({newPic: newImage});
                        }); 
                    });
                });
            });    
        } else {
            res.redirect('/');
        }
    };
};

module.exports = Controller;