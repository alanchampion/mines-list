var express = require('express');
var router = express.Router();
var ctrlClasses = require('../controllers/classes');
var ctrlLogin = require('../controllers/login');

/* Item pages */
router.get('/', ctrlClasses.classlist);
router.get('/class/:classid', ctrlClasses.classInfo);
router.get('/class/:classid/assignment/new', ctrlClasses.addAssignment);
router.post('/class/:classid/assignment/new', ctrlClasses.doAddAssignment);
router.get('/class/:classid/assignment/:assignmentid/delete', ctrlClasses.deleteAssignment);
router.get('/class/:classid/assignment/:assignmentid', ctrlClasses.updateAssignment);
router.post('/class/:classid/assignment/:assignmentid', ctrlClasses.doUpdateAssignment);

/* Login pages */
router.get('/login', ctrlLogin.loginPage);
router.get('/register', ctrlLogin.registerPage);
router.post('/login', ctrlLogin.login);
router.post('/register', ctrlLogin.register);

/* Other pages */
// router.get('/about', ctrlOthers.about);
router.get('/sell', ctrlLogin.sellPage);

module.exports = router;
