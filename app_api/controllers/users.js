var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var getUser = function(req, res, callback) {
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

module.exports.getProfile = function(req, res) {
  getAuthor(req, res, function(req, res, userName) {
    if(req.params.courseid) {
      User
        .find()
        .select("_id email name")
        .exec(function(err, user) {
          if(!user) {
            sendJsonResponse(res, 404, {"message" : "No user information found"});
            return;
          } else if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          sendJsonResponse(res, 200, user);
        });
    } else {
      sendJsonResponse(res, 404, {"message" : "Not found, log in required"});
    }
  });
};