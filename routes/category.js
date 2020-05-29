const express = require("express");
const router = express.Router();
const app = express();
const request = require('request');
const mongoose = require('mongoose');
let categObj = require('../categObj.json');
let prodObj = require('../prodObj.json');
const utils = require('../config/utils');
const Cart = require('../models/Cart');
const dotenv = require('dotenv');
dotenv.config();


app.use(express.static('public'));
app.set('view engine', 'ejs');

router.get('/home', (req, res) => {
  
  res.render('home',
  { 
    categvar: categObj
  });
});

router.get('/home/:genderId/:categoryId', (req, res) => {

  res.render('categories',
  {
    genderId: req.params.genderId,
    categoryId: req.params.categoryId,
    categvar: categObj
  });
  
});

router.get('/home/:genderId/:categoryId/:subcategoryId', (req, res) => {

    res.render('subcategories',
    {
      genderId: req.params.genderId,
      categoryId: req.params.categoryId,
      subcategoryId: req.params.subcategoryId,
      categvar: categObj,
      prodvar: prodObj
    });

});

router.get('/home/:genderId/:categoryId/:subcategoryId/:productId', (req, res) => {
  
  res.render('products',
  {
    genderId: req.params.genderId,
    categoryId: req.params.categoryId,
    subcategoryId: req.params.subcategoryId,
    productId: req.params.productId,
    categvar: categObj,
    prodvar: prodObj
  });
  
});

router.post('/home/:genderId/:categoryId/:subcategoryId/:productId', (req, res, next) => {
  const {color, size, quantity} = req.body;
  const productId = req.params.productId;

  for(var i = 0; i < prodObj.length; i++){
    if(prodObj[i].id == productId){
      for(var j = 0; j < prodObj[i].variants.length; j++){
        if(size != undefined && prodObj[i].variants[j].variation_values.color == color && prodObj[i].variants[j].variation_values.size == size){
            const variantId =  prodObj[i].variants[j].product_id;

            const newCart = new Cart({
              secretKey: process.env.MY_SECRETKEY,
              productId: productId,
              variantId: variantId,
              quantity: quantity
            });
            newCart.save();
            res.redirect('/home/shopping-cart')
        } else{
          if(size == undefined && prodObj[i].variants[j].variation_values.color == color){
            const variantId =  prodObj[i].variants[j].product_id;

            const newCart = new Cart({
              secretKey: process.env.MY_SECRETKEY,
              productId: productId,
              variantId: variantId,
              quantity: quantity
            });
            newCart.save();
            res.redirect('/home/shopping-cart')
          }
        }
      }
    }
  } 
});

router.get('/home/shopping-cart', (req, res) => {

  Cart.find({}, (err, cart) =>{
      res.render('cart', {
       cart: cart,
       prodvar: prodObj
      })

  });

});


module.exports = router;
