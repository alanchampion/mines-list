var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');
var ctrlLogin = require('../controllers/login');
//var ctrlPurchase = require('../controllers/purchase');

/* Item pages */
router.get('/', ctrlItems.itemsList);
router.get('/purchase')
router.get('/items/:itemid', ctrlItems.itemInfo);
router.get('/sell', ctrlItems.sellPage);
router.post('/sell', ctrlItems.doSellItem);
router.get('/items/:itemid/purchase', ctrlItems.purchaseItem);

router.get('/class/:classid', ctrlItems.classInfo);
router.get('/class/:classid/assignment/new', ctrlItems.addAssignment);
router.post('/class/:classid/assignment/new', ctrlItems.doAddAssignment);
router.get('/class/:classid/assignment/:assignmentid/delete', ctrlItems.deleteAssignment);
router.get('/class/:classid/assignment/:assignmentid', ctrlItems.updateAssignment);
router.post('/class/:classid/assignment/:assignmentid', ctrlItems.doUpdateAssignment);

/* Login pages */
router.get('/login', ctrlLogin.loginPage);
router.get('/register', ctrlLogin.registerPage);
router.post('/login', ctrlLogin.login);
router.post('/register', ctrlLogin.register);

/* Other pages */

module.exports = router;
