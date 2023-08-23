const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

        name: String,
        email: String,
        password: String,
        isAdmin: Boolean, 
    });


userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
