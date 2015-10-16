var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
   body: String,
   author: String,
   createdAt: { type: Date, default: new Date() },
   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upvote' }],
   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Downvote' }],
   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]    
});

mongoose.model('Comment', CommentSchema);