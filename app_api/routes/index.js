var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlClasses = require('../controllers/courses');
var ctrlAssignments = require('../controllers/assignments');
var ctrlAuth = require('../controllers/authentication');

/* Classes pages */
router.get('/courses', ctrlClasses.getCourses);
router.get('/courses/:courseid', ctrlClasses.getCourse);

/* Assignment pages */
router.post('/courses/:courseid/assignments', auth, ctrlAssignments.assignmentCreate);
router.get('/courses/:courseid/assignments', ctrlAssignments.getAssignments);
router.get('/courses/:courseid/assignments/:assignmentid', ctrlAssignments.getAssignment);
router.put('/courses/:courseid/assignments/:assignmentid', auth, ctrlAssignments.updateAssignment);
router.delete('/courses/:courseid/assignments/:assignmentid', auth, ctrlAssignments.deleteAssignment);

/* Authentication pages */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
