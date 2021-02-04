const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');

const { secret } = process.env.secret;
const UserSchema = require('./models/userSchema');

passport.use(new LocalStrategy({
    username: username,
    password: password,
},  async (username, password, done) => {
    try {
        const userDoc = await UserSchema.findOne({username: username}).exec();
        const passwordCheck = await bcrypt.compare(password, userDoc.password);

        if(passwordCheck){
            return done(null, userDoc);
        } else {
            return done ('Incorrect Username or Password');
        }
    } catch(error) {
        done(error);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest : req => req.cookies.jwt,
    secretOrKey: secret,
},

(jwtPayload, done) =>{
    if (Date.now() > jwtPayload.expires) {
        return done('jwt expired');
    }

    return done(null, jwtPayload);
    }
));
