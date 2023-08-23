const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel'); 


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});


passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password', 
}, (email, password, done) => {
    userModel.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    });
}));
