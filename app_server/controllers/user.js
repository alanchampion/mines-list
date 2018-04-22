var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://mines-list.herokuapp.com";
};

var _showError = function(req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  if(req.cookies.mineslist_token) {
    res.render('generic-text', {
     title : title,
     content : content,
     mineslist_token: req.cookies.mineslist_token,
     loggedIn: 'true'
    });
  } else {
    res.render('generic-text', {
      title : title,
      content : content
    });
  }
};

var renderProfile = function(req, res, responseBody) {
  // console.log(bodyItems);
  if(req.cookies.mineslist_token) {
    res.render('profile', {
      title: 'Profile',
      pageHeader: {
        title: 'MinesList',
        strapline: 'By students, for students.'
      },
      email: responseBody.email,
      name: responseBody.name,
      items: responseBody.items,
      mineslist_token: req.cookies.mineslist_token,
      remove: req.query.remove,
      loggedIn: 'true'
    });
  } else {
    res.render('profile', {
      title: 'Profile'
    });
  }
};

/* GET 'home' page */
module.exports.profile = function(req, res) {
  var requestOptions, path;
  path = '/api/user';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}, 
    qs : {},
    headers: {
      'Cookie': "mineslist_token=" + req.cookies.mineslist_token + ";"
    }
  }
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      renderProfile(req, res, body);
    } else if(response.statusCode === 401) {
      renderProfile(req, res, body);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}