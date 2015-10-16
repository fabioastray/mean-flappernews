var mongoose = require('mongoose');

var UpvoteSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   createdAt: { type: Date, default: new Date() }
});

mongoose.model('Upvote', UpvoteSchema);