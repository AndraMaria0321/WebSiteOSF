const jwt = require('jsonwebtoken');
const passport = require('passport');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function issueJWT(user) {
    const _id = user._id;
    const expiresIn = '60';
    const payload = {
        sub: _id,
        iat: Date.now()
    };
    const signedToken = jwt.sign(payload, process.env.JWT_PASS, {expiresIn: expiresIn});

    return {
        token: signedToken,
        expires: expiresIn
    }
};

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['Authorization'];
  
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
      next();
    } else {
        res.redirect('/auth');
    }
};

function deleteToken(req, res) {
    let bearerHeader = req.headers['authorization'];
    bearerHeader = ''
    res.header('Authorization', bearerHeader);
    res.redirect('/home');

};

function deleteProduct(req, res){
   const prod = document.getElementsByName('prodDelete');

   Cart.deleteOne({variantId: prod}, () =>{
    
    res.redirct('/home/shopping-cart')
  });
};

module.exports.issueJWT = issueJWT;
module.exports.verifyToken = verifyToken;
module.exports.deleteProduct = deleteProduct;
module.exports.deleteToken = deleteToken;