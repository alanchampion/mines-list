var express = require('express');
var router = express.Router();
var ctrlClasses = require('../controllers/classes');
// var ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlClasses.classlist);
router.get('/class/:classid', ctrlClasses.classInfo);
router.get('/class/:classid/assignment/new', ctrlClasses.addAssignment);
router.post('/class/:classid/assignment/new', ctrlClasses.doAddAssignment);
router.get('/class/:classid/assignment/:assignmentid/delete', ctrlClasses.deleteAssignment);
router.get('/class/:classid/assignment/:assignmentid', ctrlClasses.updateAssignment);
router.post('/class/:classid/assignment/:assignmentid', ctrlClasses.doUpdateAssignment);

/* Other pages */
// router.get('/about', ctrlOthers.about);

module.exports = router;
