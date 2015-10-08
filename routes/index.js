var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Upvote = mongoose.model('Upvote');
var Downvote = mongoose.model('Downvote');

/* middleware */
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });//'SECRET' it is strongly recommended that you use an environment variable

router.param('post', function(req, res, next, id){
    
   var query = Post.findById(id);
   
   query.exec(function(err, post){
       if(err){ return next(err); }
       if(!post){ return next(new Error('can\'t find post')); }
       req.post = post;
       return next();
   });
});

router.param('comment', function(req, res, next, id){
   
   var query = Comment.findById(id);
   
   query.exec(function(err, comment){
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

router.get('/posts', function(req, res, next) {
    Post.find(function (err, posts){
        if(err){ return next(err); }
        
        var postsLength = posts.length,
            finalPosts = [];
        
        for (var i = 0, len = postsLength; i < len; ++i) {
            finalPosts.push({
                _id: posts[i]._id,
                author: posts[i].author,
                title: posts[i].title,
                link: posts[i].link,
                comments: posts[i].comments,
                upvotes: posts[i].upvotes.length,
                downvotes: posts[i].downvotes.length
            });
        }
        
        res.json(finalPosts);
    });
});

router.get('/posts/:post', function(req, res) {
    req.post.populate('comments', function(err, post){
        
        var commentsLength = post.comments.length,
            finalComments = [];
                
        for (var j = 0, len = commentsLength; j < len; ++j) {
            finalComments.push({
                _id: post.comments[j]._id,
                author: post.comments[j].author,
                body: post.comments[j].body,
                comments: post.comments[j].comments,
                upvotes: post.comments[j].upvotes.length,
                downvotes: post.comments[j].downvotes.length
            });
        }
        
        res.json({
            _id: post._id,
            author: post.author,
            title: post.title,
            link: post.link,
            comments: finalComments,
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length
        });
    });
});

router.post('/posts', auth, function(req, res, next) {
    
    var post = new Post(req.body);
    post.author = req.payload.username;
    
    post.save(function (err, post){
        if(err){ return next(err); }
        
        res.json({
            _id: post._id,
            author: post.author,
            title: post.title,
            link: post.link,
            comments: post.comments,
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length
        });
    });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
    
    var upvote = new Upvote();
        upvote.user = req.payload._id;
    
    upvote.save(function (err, upvote){
        if(err){ return next(err); }
        
        req.post.upvotes.push(upvote);
        req.post.save(function (err, post){
            if(err){ return next(err); }

            res.json(post.upvotes.length);
        });
    });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
    
    var downvote = new Downvote();
        downvote.user = req.payload._id;
    
    downvote.save(function (err, downvote){
        if(err){ return next(err); }
        
        req.post.downvotes.push(downvote);
        req.post.save(function (err, post){
            if(err){ return next(err); }

            res.json(post.downvotes.length);
        });
    });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
    
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;
    
    comment.save(function (err, comment){
        if(err){ return next(err); }
        
        req.post.comments.push(comment);
        req.post.save(function (err, post){
            if(err){ return next(err); }
            
            res.json({
                _id: comment._id,
                author: comment.author,
                body: comment.body,
                comments: comment.comments,
                upvotes: comment.upvotes.length,
                downvotes: comment.downvotes.length
            });
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    
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
}); 

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
    
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
}); 

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){ return res.status(400).json({ message: 'Please fill out all the fields' }); }
    
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    
    user.save(function(err){
       if(err){ return next(err); }
       
       return res.json({ token: user.generateJWT() });
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