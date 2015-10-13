var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var _ = require('underscore');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Upvote = mongoose.model('Upvote');
var Downvote = mongoose.model('Downvote');

/* middleware */
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });//'SECRET' it is strongly recommended that you use an environment variable

router.param('post', function(req, res, next, id){
   Post.findById(id).exec(function(err, post){
       if(err){ return next(err); }
       if(!post){ return next(new Error('can\'t find post')); }
       
       req.post = post;
       return next();
   });
});

router.param('comment', function(req, res, next, id){
   Comment.findById(id).exec(function(err, comment){
       if(err){ return next(err); }
       if(!comment){ return next(new Error('can\'t find comment')); }
       
       req.comment = comment;
       return next();
   });
});
/* middleware */

/* home */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
/* home */

router.get('/profile', auth, function(req, res, next) {
    console.log(req.payload);
    User.findOne({ _id: req.payload._id }).lean().exec(function (err, user){
        if(err){ return next(err); }
        
        res.json(user);
    });
});

router.get('/posts', function(req, res, next) {
    Post.find().lean().exec(function (err, posts){
        if(err){ return next(err); }

        _(posts).each(function(post){
            post.upvotes = post.upvotes.length;
            post.downvotes = post.downvotes.length;
            post.comments = post.comments.length;
        });
        
        res.json(posts);
    });
});

router.get('/posts/:post', function(req, res) {
    req.post.populate('comments', function(err, post){
        
        post = post.toObject();
                
        _(post.comments).each(function (comment){
            comment.upvotes = comment.upvotes.length;
            comment.downvotes = comment.downvotes.length;
        });

        res.json(post);
    });
});

router.post('/posts', auth, function(req, res, next) {
    
    var post = new Post(req.body);
    post.author = req.payload.username;
    
    post.save(function (err, post){
        if(err){ return next(err); }
        
        post = post.toObject();                
        post.upvotes = 0;
        post.downvotes = 0;
        post.comments = 0;
        
        res.json(post);
    });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
    
    var userId = req.payload._id,
        alreadyVoted = false;
    
    Post.find({ _id: req.post._id }).populate({ 
        path: 'upvotes',
        match: { user: userId }})
    .exec(function (err, post){
        if(err){ return next(err); }
        
        post[0].upvotes.forEach(function(upvote){
            if(upvote.user == userId){
                alreadyVoted = true;
            } 
        });
        
        if(alreadyVoted){
            res.status(400).json({ message: 'You have already upvoted this post' });
        }else{
            var upvote = new Upvote();
                upvote.user = userId;

            upvote.save(function (err, upvote){
                if(err){ return next(err); }

                req.post.upvotes.push(upvote);
                req.post.save(function (err, post){
                    if(err){ return next(err); }

                    res.json(post.upvotes.length);
                });
            });
        }
    });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
    
    var userId = req.payload._id,
        alreadyVoted = false;
        
    Post.find({ _id: req.post._id }).populate({ 
        path: 'downvotes',
        match: { user: userId }})
    .exec(function (err, post){
        if(err){ return next(err); }
        
        post[0].downvotes.forEach(function(downvote){
            if(downvote.user == userId){
                alreadyVoted = true;
            } 
        });
        
        if(alreadyVoted){
            res.status(400).json({ message: 'You have already downvoted this post' });
        }else{
            var downvote = new Downvote();
                downvote.user = userId;

            downvote.save(function (err, downvote){
                if(err){ return next(err); }

                req.post.downvotes.push(downvote);
                req.post.save(function (err, post){
                    if(err){ return next(err); }

                    res.json(post.downvotes.length);
                });
            });
        }
    });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
    
    var comment = new Comment(req.body);
    
    comment.save(function (err, comment){
        if(err){ return next(err); }
        
        req.post.comments.push(comment);
        req.post.save(function (err, post){
            if(err){ return next(err); }
            
            comment = comment.toObject();
            comment.upvotes = comment.upvotes.length;
            comment.downvotes = comment.downvotes.length;
            
            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    
    var userId = req.payload._id,
        alreadyVoted = false;
    
    Comment.find({ _id: req.comment._id }).populate({ 
        path: 'upvotes',
        match: { user: userId }})
    .exec(function (err, comment){
        if(err){ return next(err); }
        
        comment[0].upvotes.forEach(function(upvote){
            if(upvote.user == userId){
                alreadyVoted = true;
            } 
        });
        
        if(alreadyVoted){
            res.status(400).json({ message: 'You have already upvoted this comment' });
        }else{
            var upvote = new Upvote();
                upvote.user = req.payload._id;

            upvote.save(function (err, upvote){
                if(err){ return next(err); }

                req.comment.upvotes.push(upvote);
                req.comment.save(function (err, comment){
                    if(err){ return next(err); }

                    res.json(comment.upvotes.length);
                });
            });
        }
    });
}); 

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
    
    var userId = req.payload._id,
        alreadyVoted = false;
    
    Comment.find({ _id: req.comment._id }).populate({ 
        path: 'downvotes',
        match: { user: userId }})
    .exec(function (err, comment){
        if(err){ return next(err); }
        
        comment[0].downvotes.forEach(function(downvote){
            if(downvote.user == userId){
                alreadyVoted = true;
            } 
        });
        
        if(alreadyVoted){
            res.status(400).json({ message: 'You have already downvoted this comment' });
        }else{
            var downvote = new Downvote();
                downvote.user = req.payload._id;

            downvote.save(function (err, downvote){
                if(err){ return next(err); }

                req.comment.downvotes.push(downvote);
                req.comment.save(function (err, comment){
                    if(err){ return next(err); }

                    res.json(comment.downvotes.length);
                });
            });
        }
    });
}); 

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){ return res.status(400).json({ message: 'Please fill out all the fields' }); }
    
    User.findOne({ username: req.body.username.toLowerCase() }).exec(function(err, user){
        if(err){ return next(err); }
        
        if(user){
            return res.status(400).json({ message: 'Please choose another username, this is currently in use' });
        }else{
            var user = new User();
            user.username = req.body.username;
            user.setPassword(req.body.password);

            user.save(function(err){
               if(err){ return next(err); }

               return res.json({ token: user.generateJWT() });
            });
        }
    });
    
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){ return res.status(400).json({ message: 'Please fill out all the fields' }); }
    
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
        
        return user ? res.json({ token: user.generateJWT() }) : res.status(401).json(info);
    })(req, res, next);
});

module.exports = router;