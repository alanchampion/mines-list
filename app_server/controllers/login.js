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
   res.render('generic-text', {
   title : title,
   content : content
   }); 
};

var renderLoginPage = function(req, res) {
  res.render('login', {
    title: 'MinesList',
    pageHeader: {
      title: 'Login to MinesList',
      strapline: 'By students, for students.'
    },
    formInfo: {
      email: 'Email',
      password: 'Password'
    },
    error: req.query.err
  });
}

module.exports.loginPage = function(req, res) {
  renderLoginPage(req, res);
}

var renderRegisterPage = function(req, res) {
  res.render('register', {
    title: 'MinesList',
    pageHeader: {
      title: 'Register for MinesList',
      strapline: 'By students, for students.'
    },
    formInfo: {
      name: 'Full Name',
      email: 'Email',
      password: 'Password'
    },
    error: req.query.err
  });
}

module.exports.registerPage = function(req, res) {
  renderRegisterPage(req, res);
}

module.exports.register = function(req, res) {
  var requestOptions, path, postdata;
  path = "/api/register";
  postdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST", 
    json: postdata
  };
  if (!postdata.name || !postdata.email || !postdata.password) {
    res.redirect('/register?err=missing');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 201) {
        res.redirect('/');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/register?err=missing');
      } else if (response.statusCode === 400) {
        res.redirect('/register?err=missing');
      } else if (response.statusCode === 409) {
        res.redirect('/register?err=failed');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};

module.exports.login = function(req, res) {
  var requestOptions, path, postdata;
  path = "/api/login";
  postdata = {
    email: req.body.email,
    password: req.body.password
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST", 
    json: postdata
  };
  if (!postdata.email || !postdata.password) {
    res.redirect('/login?err=missing');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 202) {
        res.cookie("mineslist_token", body.token, {expires: new Date(Date.now() + 3600000)});
        res.cookie("user_email", req.body.email, {expires: new Date(Date.now() + 3600000)});
        res.redirect('/');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/login?err=missing');
      } else if (response.statusCode === 400) {
        res.redirect('/login?err=missing');
      } else if (response.statusCode === 409) {
        res.redirect('/login?err=failed');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};
