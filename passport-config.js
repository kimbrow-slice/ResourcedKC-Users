const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
const UserSchema = require('./models/userSchema');

passport.use('jwt', new JWTStrategy({
    jwtFromRequest : req => req.cookies.jwt,
    secretOrKey: process.env.secret
},

(jwtPayload, done) =>{
    if (Date.now() > jwtPayload.expires) {
        return done('jwt expired');
    }

    return done(null, jwtPayload);
    }
));

passport.use('local', new LocalStrategy( async (username, password, done) => {
    console.log(username);
    try {
        const userDoc = await UserSchema.findOne({username}).exec();
        const passwordCheck = await bcrypt.compare(password, userDoc.password);
        console.log(userDoc);
        console.log(passwordCheck);
        
        

        if(passwordCheck){
            return done(null, userDoc);
        } else {
            return done ('Incorrect Username or Password');
        }
    }
    catch{ (err) => done(err) }
}));

