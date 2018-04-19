var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var getUser = function(req, res, callback) {
  if (req.payload.email) {
    User
      .findOne({ email : req.payload.email })
      .select("_id email name")
      .exec(function(err, user) {
        if (!user) {
          sendJsonResponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJsonResponse(res, 404, err);
          return;
        }
        callback(req, res, user);
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};

module.exports.getProfile = function(req, res) {
  getUser(req, res, function(req, res, user) {
    sendJsonResponse(res, 200, user);
  });
};