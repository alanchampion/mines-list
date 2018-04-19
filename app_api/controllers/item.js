var mongoose = require('mongoose');
var Items = mongoose.model('Item');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var doAddItem = function(req, res, course, author) {
  if(!course) {
    sendJsonResponse(res, 404, {"message" : "courseid not found"});
  } else {
    course.assignments.push({
      author: author,
      name: req.body.name,
      due: req.body.due, 
      value: req.body.value,
      status: req.body.status
    });
    course.save(function(err, course) {
      var thisAssignment;
      if(err) {
        console.log(err);
        sendJsonResponse(res, 400, err);
      } else {
        thisAssignment = course.assignments[course.assignments.length - 1];
        sendJsonResponse(res, 201, thisAssignment)
      }
    })
  }
}

module.exports.getItems = function(req, res) {
}
module.exports.getItem = function(req, res) {
}
module.exports.deleteAssignment = function(req, res){
	
}

module.exports.assignmentCreate = function(req, res) {
	
}