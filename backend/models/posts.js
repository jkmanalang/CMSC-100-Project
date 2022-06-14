const mongoose = require("mongoose");

// schema for posts
const postSchema = new mongoose.Schema({
    timestamp: {type: Date, required: true},
    author: {type: String, required: true},
    authorName: {type: String, required: true},
    content: {type: String, required: true}
})


module.exports = mongoose.model("Post", postSchema);
