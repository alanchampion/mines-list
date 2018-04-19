var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  getToken: function fromHeader(req) {
  	if(req.cookies.mineslist_token) {
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

/* Classes pages*/
router.get('/courses', auth, ctrlClasses.getCourses);
router.get('/courses/:courseid', auth, ctrlClasses.getCourse); 

/* Item pages 
router.post('items',auth, ctrlItem.itemCreate);
router.get('items', ctrlItem.getItems);
router.get('items', ctrlItem.getItems);
router.delete('items',auth, ctrlItem.deleteAssignment); 
*/
/* Authentication pages */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

/* Users api */
router.get('/user', auth, ctrlUsers.getProfile);

module.exports = router;
