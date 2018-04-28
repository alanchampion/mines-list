var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');
var ctrlLogin = require('../controllers/login');
var ctrlUser = require('../controllers/user');
//var ctrlPurchase = require('../controllers/purchase');

/* Item pages */
router.get('/', ctrlItems.itemsList);
router.get('/purchase')
router.get('/items/:itemid', ctrlItems.itemInfo);
router.get('/sell', ctrlItems.sellPage);
router.post('/sell', ctrlItems.doSellItem);
router.get('/items/:itemid/purchase', ctrlItems.purchaseItem);
router.get('/items/:itemid/delete', ctrlItems.deleteItem);

/* Login pages */
router.get('/login', ctrlLogin.loginPage);
router.get('/register', ctrlLogin.registerPage);
router.post('/login', ctrlLogin.login);
router.post('/register', ctrlLogin.register);

/* Other pages */
router.get('/profile', ctrlUser.profile);
router.get('/about', ctrlUser.about);

module.exports = router;
