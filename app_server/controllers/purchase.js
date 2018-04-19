var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://mines-list.herokuapp.com";
};
// var authentication = require('javascripts/authentication');

var renderClass = function(req, res, responseBody) {
  res.render('Sale Items', {
    title: 'Items for sale',
    pageHeader: 'Get your stuff here',
    classInfo: responseBody.classInfo,
    items: responseBody.items,
    error: req.query.err,
    unsubmitted: req.query.unsubmitted
  });
}



module.exports.classlist = function(req, res) {
  renderClassList(req, res);
  var requestOptions, path;
  path = '/api/items';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}, 
    qs : {}
  }
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      renderClassList(req, res, body);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}