var mongoose = require('mongoose');
var Classes = mongoose.model('Class');
var Assignments = mongoose.model('Assignment');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var getAuthor = function(req, res, callback) {
  if (req.payload && req.payload.email) {
    User
      .findOne({ email : req.payload.email })
      .exec(function(err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        callback(req, res, user.name);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};

var doAddAssignment = function(req, res, course, author) {
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

module.exports.assignmentCreate = function(req, res) {
  getAuthor(req, res, function(req, res, userName) {
    if(req.params.courseid) {
      Classes
        .findById(req.params.courseid)
        .select('assignments')
        .exec(function(err, course) {
          if(err) {
            sendJsonResponse(res, 400, err);
            return;
          } else {
            doAddAssignment(req, res, course);
          }
        });
    } else {
      sendJsonResponse(res, 404, {"message" : "Not found, courseid required"});
    }
  });
};

module.exports.getAssignments = function(req, res) {
  if (req.params && req.params.courseid) {
    Classes
      .findById(req.params.courseid)
      .select('assignments')
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

module.exports.getAssignment = function(req, res) {
  if (req.params && req.params.courseid && req.params.assignmentid) {
    Classes
      .findById(req.params.courseid)
      .select('assignments name')
      .exec(function(err, course) {
        var thisAssignment;
        if(!course) {
          sendJsonResponse(res, 404, {"message" : "courseid not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        if(course.assignments && course.assignments.length > 0) {
        thisAssignment = course.assignments.id(req.params.assignmentid);
        if(!thisAssignment) {
          sendJsonResponse(res, 404, {"message" : "assignmentid not found"});
        } else {
          var data = {
            status: thisAssignment.status,
            name: thisAssignment.name,
            due: thisAssignment.due,
            value: thisAssignment.value,
            _id: thisAssignment._id,
            courseName: course.name
          };
          sendJsonResponse(res, 200, data);
        }
      } else {
        sendJsonResponse(res, 404, {"message" : "No assignment to update"});
      }
      });
  }
  else {
    sendJsonResponse(res, 404, {"message" : "No courseid in request"});
  }
};

module.exports.updateAssignment = function(req, res) {
  console.log("Api update assignment");
  if(!req.params.courseid || !req.params.assignmentid) {
    sendJsonResponse(res, 404, {"message" : "Not found, courseid and assignmentid are both required"});
    return;
  }
  Classes
    .findById(req.params.courseid)
    .select('assignments')
    .exec(function(err, course) {
      var thisAssignment;
      if(!course) {
        sendJsonResponse(res, 404, {"message" : "courseid not found"});
        return;
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      }
      if(course.assignments && course.assignments.length > 0) {
        thisAssignment = course.assignments.id(req.params.assignmentid);
        if(!thisAssignment) {
          sendJsonResponse(res, 404, {"message" : "assignmentid not found"});
        } else {
          if(req.body.name){
            thisAssignment.name = req.body.name;
          }
          if(req.body.due) {
            thisAssignment.due = req.body.due;
          }
          if(req.body.value) {
            thisAssignment.value = req.body.value;
          }
          if(req.body.status) {
            thisAssignment.status = req.body.status;
          }
          course.save(function(err, course) {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 200, thisAssignment);
            }
          })
        }
      } else {
        sendJsonResponse(res, 404, {"message" : "No assignment found to update"});
      }
    });
};

module.exports.deleteAssignment = function(req, res) {
  if (!req.params.courseid || !req.params.assignmentid) {
    sendJsonResponse(res, 404, {"message" : "Not found, courseid and assignmentid are both required"});
    return;
  }
  Classes
    .findById(req.params.courseid)
    .select('assignments')
    .exec(function(err, course) {
      if(!course) {
        sendJsonResponse(res, 404, {"message" : "courseid not found"});
        return;
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      }
      if(course.assignments && course.assignments.length > 0) {
        if(!course.assignments.id(req.params.assignmentid)) {
          sendJsonResponse(res, 404, {"message" : "assignmentid not found"});
        } else {
          course.assignments.id(req.params.assignmentid).remove();
          course.save(function(err) {
            if(err) {
              console.log(err);
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 204, null);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {"message" : "No review to delete"});
      }
    });
};