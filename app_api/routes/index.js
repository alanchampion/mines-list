var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  getToken: function fromHeader(req) {
    // console.log(req.cookies);
  	if(req.cookies.mineslist_token) {
      // console.log("Authenticated!");
  		return req.cookies.mineslist_token;
  	}
  	return null;
  }
});
var ctrlClasses = require('../controllers/courses');
// var ctrlAssignments = require('../controllers/assignments');
var ctrlUsers = require('../controllers/users');
var ctrlAuth = require('../controllers/authentication');
var ctrlItem = require('../controllers/item');

/* Item pages */
router.post('/items', auth, ctrlItem.postItem);
router.get('/items', ctrlItem.getItems);
// router.get('/items', ctrlItem.getItems);
router.delete('/items/:itemid', auth, ctrlItem.deleteItem); 

/* Authentication pages */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

/* Users api */
router.get('/user', auth, ctrlUsers.getProfile);

module.exports = router;
