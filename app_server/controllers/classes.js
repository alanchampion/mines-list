var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://mines-list.herokuapp.com";
};
// var authentication = require('javascripts/authentication');

var getToken = function () {
  return localStorage['mineslist_token'];
};

var isLoggedIn = function() {
  var token = getToken();
  if(token){
    var payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
};

var currentUser = function() {
  if(isLoggedIn()){
    var token = getToken();
    var payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email : payload.email,
      name : payload.name
    };
  }
};

var formatDate = function(dateString) {
  var date = new Date(dateString);
  // var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
  var d = date.getDate() + 1;
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  if(m < 10)
    m = "0"+m;
  if(d < 10)
    d = "0"+d;
  var output = y + '-' + m + '-' + d;
  return output;
}

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

var renderClassList = function(req, res, responseBody) {
  console.log(req.cookies.mineslist_token);
  var message;
  if(!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = {};
  } else {
    if(!responseBody.length) {
      message = "No items found";
    }
  }
  if(req.cookies.mineslist_token) {
    res.render('classes-list', {
      title: 'MinesList',
      pageHeader: {
        title: 'MinesList',
        strapline: 'By students, for students.'
      },
      sidebar: "Sell and buy things with the Mines campus! Select an item to get started, or click sell above to get started selling of your old junk.",
      classes: responseBody,
      message: message,
      mineslist_token: req.cookies.mineslist_token,
      loggedIn: 'true'
    });
  } else {
    res.render('classes-list', {
      title: 'MinesList',
      pageHeader: {
        title: 'MinesList',
        strapline: 'By students, for students.'
      },
      sidebar: "Sell and buy things with the Mines campus! Select an item to get started, or click sell above to get started selling of your old junk.",
      classes: responseBody,
      message: message
    });
  }
};

/* GET 'home' page */
module.exports.classlist = function(req, res) {
  renderClassList(req, res);
  /*var requestOptions, path;
  path = '/api/courses';
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
  });*/
}

var renderClass = function(req, res, responseBody) {
  res.render('class-info', {
    title: 'Class Info',
    pageHeader: responseBody.pageHeader,
    classInfo: responseBody.classInfo,
    assignments: responseBody.assignments,
    error: req.query.err,
    unsubmitted: req.query.unsubmitted
  });
}

/* GET 'Location info' page */
module.exports.classInfo = function(req, res) {
  var requestOptions, path;
  path = "/api/courses/" + req.params.classid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET", 
    json: {},
    qs : {}
  };
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      var data;
      data = body;
      data.classInfo = {
        instructor : body.instructor,
        credits : body.credits,
        location : body.location,
        _id : body._id
      };
      data.pageHeader = {
        title: body.id + " " + body.name
      };
      renderClass(req, res, data);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
};

var renderAssignmentForm = function(req, res, responseBody) {
  res.render('class-assignment-form', {
    title: 'Add assignment',
    pageHeader: {
      title: 'Add Assignment for ' + responseBody.name
    },
    formInfo: {
      name: 'Name',
      due: 'Due',
      points: 'Points',
      status: 'Status'
    },
    statuses: ['Not started','In progress','Done','Submitted'],
    error: req.query.err
  });
};

/* GET 'Add review' page */
module.exports.addAssignment = function(req, res) {
  var requestOptions, path;
  path = '/api/courses/' + req.params.classid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}, 
    qs : {}
  }
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      renderAssignmentForm(req, res, body);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
};

module.exports.doAddAssignment = function(req, res) {
  var requestOptions, path, classid, postdata;
  classid = req.params.classid;
  path = "/api/courses/" + classid + "/assignments";
  postdata = {
    name: req.body.name,
    due: req.body.due,
    value: req.body.points,
    status: req.body.status
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST", 
    json: postdata
  };
  if (!postdata.name || !postdata.due || !postdata.value || !postdata.status) {
    res.redirect('/class/' + classid + '/assignment/new?err=val');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 201) {
        res.redirect('/class/' + classid);
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/class/' + classid + '/assignment/new?err=val');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};

module.exports.deleteAssignment = function(req, res) {
  var requestOptions, path, classid, assignmentid, postdata;
  classid = req.params.classid;
  assignmentid = req.params.assignmentid;
  path = "/api/courses/" + classid + "/assignments/" + assignmentid;
  postdata = {
    courseid: classid,
    assignmentid: assignmentid
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE", 
    json: postdata
  };
  if (!postdata.courseid || !postdata.assignmentid) {
    res.redirect('/class/' + classid + '?err=delete');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 204) {
        res.redirect('back');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/class/' + classid + '?err=delete');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
}

var renderUpdateAssignmentForm = function(req, res, responseBody) {
  res.render('class-assignment-update', {
    title: 'Update assignment',
    pageHeader: {
      title: 'Update Assignment for ' + responseBody.courseName
    },
    formInfo: {
      name: 'Name',
      due: 'Due',
      points: 'Points',
      status: 'Status'
    },
    statuses: ['Not started','In progress','Done','Submitted'],
    error: req.query.err,
    oldInfo: {
      name: responseBody.name,
      due: formatDate(responseBody.due),
      value: responseBody.value.toString(),
      status: responseBody.status
    }
  });
};

module.exports.updateAssignment = function(req, res) {
  console.log("System go to page");
  var requestOptions, path, classid, assignmentid;
  classid = req.params.classid;
  assignmentid = req.params.assignmentid;
  path = "/api/courses/" + classid + "/assignments/" + assignmentid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}, 
    qs : {}
  }
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      renderUpdateAssignmentForm(req, res, body);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}

module.exports.doUpdateAssignment = function(req, res) {
  console.log("System do update");
  var requestOptions, path, classid, assignmentid, postdata;
  classid = req.params.classid;
  assignmentid = req.params.assignmentid;
  path = "/api/courses/" + classid + "/assignments/" + assignmentid;
  postdata = {
    name: req.body.name,
    due: req.body.due,
    value: req.body.points,
    status: req.body.status
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "PUT", 
    json: postdata
  };
  if (!postdata.name || !postdata.due || !postdata.value || !postdata.status) {
    res.redirect('/class/' + classid + '/assignment/' + assignmentid + '?err=val');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 200 || response.statusCode === 204) {
        res.redirect('/class/' + classid);
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/class/' + classid + '/assignment/' + assignmentid + '?err=val');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
}