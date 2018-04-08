var mongoose = require('mongoose');
var Classes = mongoose.model('Class');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.getCourses = function(req, res) {
  Classes
    .find()
    .select("_id name id instructor")
    .exec(function(err, courses) {
      if(!courses) {
        sendJsonResponse(res, 404, {"message" : "No courses found"});
        return
      } else if (err) {
        sendJsonResponse(res, 404, err);
      }
      sendJsonResponse(res, 200, courses);
    });
};

module.exports.getCourse = function(req, res) {
  if (req.params && req.params.courseid) {
    Classes
      .findById(req.params.courseid)
      .exec(function(err, course) {
        if(!course) {
          sendJsonResponse(res, 404, {"message" : "courseid not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, course);
      });
  }
  else {
    sendJsonResponse(res, 404, {"message" : "No courseid in request"});
  }
};