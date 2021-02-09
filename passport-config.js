const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const UserSchema = require('./models/userSchema');


var cookieExtractor = function(req){
    var token = null;
    if(req && req.cookies) token = req.cookies['jwt'];
    console.log("extrated: ");
    console.log(token);
    return token; 
};

passport.use('jwt', new JWTStrategy({
    jwtFromRequest :  cookieExtractor,
    secretOrKey: process.env.secret
},

(jwtPayload, done) =>{
    if (Date.now() > jwtPayload.expires) {
        return done('jwt expired');
    }
    console.log("authed:");
    console.log(jwtPayload);
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

