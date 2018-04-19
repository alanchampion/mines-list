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

/* Classes pages*/
router.get('/courses', auth, ctrlClasses.getCourses);
router.get('/courses/:courseid', auth, ctrlClasses.getCourse); 

/* Assignment pages
router.post('/courses/:courseid/assignments', auth, ctrlAssignments.assignmentCreate);
router.get('/courses/:courseid/assignments', ctrlAssignments.getAssignments);
router.get('/courses/:courseid/assignments/:assignmentid', ctrlAssignments.getAssignment);
router.put('/courses/:courseid/assignments/:assignmentid', auth, ctrlAssignments.updateAssignment);
router.delete('/courses/:courseid/assignments/:assignmentid', auth, ctrlAssignments.deleteAssignment); */

/* Authentication pages */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

/* Users api */
router.get('/user', auth, ctrlUsers.getProfile);

module.exports = router;
