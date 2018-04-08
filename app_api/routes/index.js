var express = require('express');
var router = express.Router();
var ctrlClasses = require('../controllers/courses');
var ctrlAssignments = require('../controllers/assignments');

/* Classes pages */
router.get('/courses', ctrlClasses.getCourses);
router.get('/courses/:courseid', ctrlClasses.getCourse);

// Assignment pages
router.post('/courses/:courseid/assignments', ctrlAssignments.assignmentCreate);
router.get('/courses/:courseid/assignments', ctrlAssignments.getAssignments);
router.get('/courses/:courseid/assignments/:assignmentid', ctrlAssignments.getAssignment);
router.put('/courses/:courseid/assignments/:assignmentid', ctrlAssignments.updateAssignment);
router.delete('/courses/:courseid/assignments/:assignmentid', ctrlAssignments.deleteAssignment);

/* Other pages */
// router.get('/about', ctrlOthers.about);

module.exports = router;
