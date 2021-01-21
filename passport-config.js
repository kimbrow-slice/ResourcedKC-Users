// require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret;

module.exports = new JwtStrategy(opts, async (jwt_payload,done)=> {
    const user = await (req.body.email);
    if( jwt_payload.email === req.body.email){
        return done(null, true)
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
    
})


// function initalizePassport(passport, getUserByName, getUserById){
//     const authenticateUser = async (username, password, done) => {
//         const user = await getUserByName(username);
//         //password below isn't being logged
//         console.log(password); 
//         if( jwt_payload.username === req.body.username){
//             return done(null, true)
//         }

//         try {
//             if (await bcrypt.compare(password, user.password)){
//                 return done(null, user);
//              } else {
//                  return done(null, false, { message: "Password is incorrect"});
//              }
//         } catch (e) {
//             return done(e);
//         }
//     }
    

//     });
// }


// initalizePassport();

