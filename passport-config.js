const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initalizePassport(passport, getUserByName, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByName(username)
        // console.log(user); 
        if(user == null){
            return done(null, false, {message : 'Username was not found within the database' });
        } 

        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user);
             } else {
                 return done(null, false, { message: "Password is incorrect"});
             }
        } catch (e) {
            return done(e);
        }
    }
    
    passport.use( new LocalStrategy( { usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => done(null,user._id));
    passport.deserializeUser((id, done) => { 
        return done(null,getUserById(id))
    });
}

module.exports = initalizePassport;