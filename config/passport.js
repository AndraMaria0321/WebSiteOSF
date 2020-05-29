const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_PASS,

};

const strategy = new JwtStrategy(options, (payload, done) =>{
   
    User.findOne({_id: payload.sub})
        .then((user) => {
            if(!user){
                return done(null, false, {message: 'Email not registered.'});
            } else {
                return don(null, user);
            }
        })
        .catch(err => done(err, null));
});

