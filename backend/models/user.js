const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schema for users 
const UserSchema = new mongoose.Schema({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    frequests: {type: [mongoose.Schema.Types.ObjectId], required: true},
    friends: {type: [mongoose.Schema.Types.ObjectId], required: true}
})


// pre saved hook. this function will be triggered whenever the user is saved
// its an additional operation to encrypt the password
// it is only triggered before a save operation (created for first time or edit afterwards)
UserSchema.pre("save", function(next) {
    const user = this;

    // for edits, it will only triggered when the password is modified
    if (!user.isModified("password")) return next();


    // this return statement return a modified version of the user document, assuming there is no error
    // in this modified user document, the value of the password field is salted in hash
    return bcrypt.genSalt((saltError, salt) => {
        if(saltError) {return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if(hashError) {return next(hashError); }

            user.password = hash;
            return next();
        });
    });
});

// custom method
UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}


module.exports = mongoose.model("User", UserSchema);