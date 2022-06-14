const authController = require("./auth-controller");

module.exports = (app) => {

    app.post("/signup", authController.signUp);
    app.post("/login", authController.login);
    app.post("/checkifloggedin", authController.checkIfLoggedIn);
    app.post("/search", authController.userSearch);
    app.post("/findUser", authController.findUser);
    app.post("/findUserMany", authController.findUserMany);
    app.post("/friendrequestsent", authController.sendFriendRequest);
    app.post("/acceptRequest", authController.acceptRequest);
    app.post("/rejectRequest", authController.rejectRequest);
    app.post("/unfriend", authController.unfriend);


    app.post("/getPosts", authController.getPosts);
    app.post("/newpost", authController.newPost);
    app.post("/editpost", authController.editPost);
    app.post("/deletePost", authController.deletePost);
}