const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// get user model registered in Mongoose
const User = mongoose.model("User");

// middleware functions
exports.signUp = (req, res) => {
  const newuser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  });

  console.log("New user: ");
  console.log(newuser);
  console.log(req.body.fname);

  newuser.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { res.send({ success: true }); }
  });
}

exports.login = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      // Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist")
      return res.send({ success: false });
    }

    user.comparePassword( password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password")
        return res.send({ success: false });
      }

      console.log("Successfully logged in");

      // Scenario 3 SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING"); // the string should be in environment file
      const name = user.fname + " " + user.lname;
      return res.send({ success:true, token, username: name, id: user._id});
    })
    
  })
}

exports.checkIfLoggedIn = (req, res) => {

  if(!req.cookies || !req.cookies.authToken){
    // Scenario 1: FAIL - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }
  
  // Token is present. Validate it 
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err){
        // Scenario 2: FAIL - Error validating token

        return res.send({ isLoggedIn: false });
      }

      const userId = tokenPayload._id;

      return User.findById(userId, (userErr, user) => {
        if(userErr || !user) {
          // Scenario 3: FAIL - Failed to find user based on id inside token payload
          return res.send({ isLoggedIn: false });
        }

        // Scenario 4: SUCCESS - token and user id are valid
        console.log("user is currently logged in");
        return res.send({ isLoggedIn: true });
      });
    });
}

// find user that matches the first or last name based on the given substring
exports.userSearch = (req, res) => {
  const userName = req.body.userName;
  // const currentUser = req.body.currentUser;

  User.find( 
    {$or:[ {'fname': new RegExp(userName, 'i')}, {'lname': new RegExp(userName, 'i')}]}, 
    function(err,docs){
      if(!err) res.send(docs);
  });

}

exports.findUser = (req, res) => {
  if (!req.body.id) { return res.send('No id provided') }

  User.findOne({ _id: req.body.id}, (err, user) => {
    if (!err) { res.send(user) }
  })
}

exports.findUserMany = (req, res) => {
  if (!req.body.ids) { return res.send('No ids provided') }

  User.find({ _id: {$in: req.body.ids}}, (err, docs) => {
    if (!err) { res.send(docs) }
  })
}

// send friend request
exports.sendFriendRequest = (req, res) => {
  const friendRequestId = req.body.friendRequestId;
  const currentUser = req.body.currentUser;

  User.updateOne({_id: friendRequestId}, 
    {$addToSet: {frequests: currentUser} }, 
    function (err, docs) {
      if(!err) res.send({success: true})
  });
}

// accept a request. update user.friends, user.frequests, and the new friend's friends
exports.acceptRequest = (req, res) => {
  const id = req.body.id;
  const acceptId = req.body.acceptId;

  User.updateOne({_id: id}, 
    {$addToSet: {friends: acceptId} }, 
    function (err, docs) {
      if(!err) {
        User.updateOne({_id: id},
          {$pull : {
            frequests: acceptId
          }},
          function (err, docs) {
            // if(!err) res.send({success: true})
            if(!err) {
              User.updateOne({_id: acceptId},
                {$addToSet: {friends: id} },
                function (err, docs) {
                  if(!err) res.send({success: true})
                })
            }
          })
      }
  });
}

// unfriended a user. update both the unfriended and the user
exports.unfriend = (req, res) => {
  const id = req.body.id;
  const friendId = req.body.friendId;

  User.updateOne({_id: id},
    {$pull : {
      friends: friendId
    }},
    function(err, docs) {
      User.updateOne({_id:friendId},
        {$pull : {
          friends: id
        }},
        function(err, docs){
          if(!err) {
            res.send({success: true})
          } 
        })
    })
}

// user rejected a friend request
exports.rejectRequest = (req, res) => {
  const id = req.body.id;
  const rejectId = req.body.rejectId;

  User.updateOne({_id: id}, 
    {$pull : { frequests: rejectId }}, 
    function (err, docs) {
      if(!err) res.send({success: true})
  });
}



// work for posts
const Post = mongoose.model("Post");

// get posts based on the given id and friends id
exports.getPosts = (req, res, next) => {
  const id = req.body.id;
  const friendsId = req.body.friendsId;

  Post.find({ $or: [ { author: id}, { author: {$in: friendsId} } ] })
  .sort({timestamp:-1}).exec((err, posts) => {
    if(!err){
      res.send(posts)
    } 
  })
}

// creating new post
exports.newPost = (req, res) => {
  const newpost = new Post({
    timestamp: req.body.timestamp,
    author: req.body.author,
    authorName: req.body.authorName,
    content: req.body.content
  });

  console.log("New post: ");
  console.log(newpost);

  newpost.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { res.send({ success: true }); }
  });
}

// edit post
exports.editPost = (req, res, next) => {
  const postId = req.body.postId;
  const newTime = req.body.newTime;
  const newContent = req.body.newContent;

  Post.updateOne({_id: postId},
    {timestamp: newTime, content: newContent},
    (err, output) => {
      if(!err) res.send({success: true})
  })
}

// delete post
exports.deletePost = (req, res, next) => {
  const postId = req.body.postId;

  Post.deleteOne({_id: postId},
    (err, output) => {
      if(!err) res.send({success: true})
  })
}