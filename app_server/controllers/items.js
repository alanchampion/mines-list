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

var renderSellPage = function(req, res) {
  if(req.cookies.mineslist_token) {
    res.render('sell', {
    title: 'MinesList',
      pageHeader: {
        title: 'Sell Item',
      strapline: 'By students, for students.'
      },
      mineslist_token: req.cookies.mineslist_token,
      loggedIn: 'true',
      error: req.query.err
    });
  } else {
    res.render('sell', {
    title: 'MinesList',
      pageHeader: {
        title: 'Sell Item',
      strapline: 'By students, for students.'
      },
      error: req.query.err
    });
  }
}

module.exports.sellPage = function(req, res) {
  renderSellPage(req, res);
}

var renderItemsList = function(req, res, responseBody) {
  // console.log(req.cookies.mineslist_token);
  var message;
  if(!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = {};
  } else {
    if(!responseBody.length) {
      message = "No items found";
    }
  }
  var bodyItems = []
  for(var i = 0; i < responseBody.length; i++) {
    for(var j = 0; j < responseBody[i].items.length; j++) {
      // console.log(responseBody[i].items[j]);
      bodyItems.push(responseBody[i].items[j]);
    }
  }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  bodyItems = shuffle(bodyItems);

  // console.log(res);
  if(req.cookies.mineslist_token) {
    res.render('items-list', {
      title: 'MinesList',
      pageHeader: {
        title: 'MinesList',
        strapline: 'By students, for students.'
      },
      sidebar: "Sell and buy things with the Mines campus! Select an item to get started, or click sell above to get started selling of your old junk.",
      items: bodyItems,
      message: message,
      purchase: req.query.purchase,
      mineslist_token: req.cookies.mineslist_token,
      loggedIn: 'true'
    });
  } else {
    res.render('items-list', {
      title: 'MinesList',
      pageHeader: {
        title: 'MinesList',
        strapline: 'By students, for students.'
      },
      sidebar: "Sell and buy things with the Mines campus! Select an item to get started, or click sell above to get started selling of your old junk.",
      items: bodyItems,
      message: message,
      purchase: req.query.purchase
    });
  }
};

/* GET 'home' page */
module.exports.itemsList = function(req, res) {
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
      renderItemsList(req, res, body);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}

var renderItem = function(req, res, responseBody) {
  // console.log(responseBody);
  if(req.cookies.mineslist_token) {
    res.render('item-info', {
      title: 'Item Info',
      name: responseBody.name,
      price: responseBody.price,
      seller: responseBody.seller,
      email: responseBody.email,
      description: responseBody.description,
      id: responseBody._id,
      error: req.query.err,
      mineslist_token: req.cookies.mineslist_token,
      loggedIn: 'true'
    });
  } else {
    res.render('item-info', {
      /*title: 'Item Info',
      name: responseBody.name,
      price: responseBody.price,
      seller: responseBody.seller,
      description: responseBody.description,
      id: responseBody._id,*/
      error: req.query.err
    });
  }
}

/* GET 'Location info' page */
module.exports.itemInfo = function(req, res) {
  var requestOptions, path, postdata;
  path = "/api/items/" + req.params.itemid;
  postdata = {
    payload: req.cookies.user_email
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET", 
    json: {},
    qs : {},
    headers: {
      'Cookie': "mineslist_token=" + req.cookies.mineslist_token + ";"
    }
  };
  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 200) {
      var data;
      data = body;
      renderItem(req, res, data);
    } else {
      if(response.statusCode == 401) {
        renderItem(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  });
};

module.exports.doSellItem = function(req, res) {
  var requestOptions, path, postdata;
  path = "/api/items/";
  postdata = {
    name: req.body.item,
    description: req.body.description,
    price: req.body.cost
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST", 
    json: postdata,
    headers: {
      'Cookie': "mineslist_token=" + req.cookies.mineslist_token + ";"
    }
  };
  if (!postdata.name || !postdata.description || !postdata.price) {
    res.redirect('/sell?err=val');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 201) {
        res.redirect('/');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/sell?err=val');
      } else if (response.statusCode === 401) {
        res.redirect('/sell?err=auth');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
}

module.exports.purchaseItem = function(req, res) {
  var requestOptions, path, classid, itemid, postdata;
  itemid = req.params.itemid;
  path = "/api/items/" + itemid;
  postdata = {
    itemid: itemid
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE", 
    json: postdata,
    headers: {
      'Cookie': "mineslist_token=" + req.cookies.mineslist_token + ";"
    }
  };
  if (!postdata.itemid) {
    res.redirect('/items/' + itemid + '?err=purchase');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 204) {
        res.redirect('/?purchase=complete');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/items/' + itemid + '?err=purchase');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
}

module.exports.deleteItem = function(req, res) {
  var requestOptions, path, classid, itemid, postdata;
  itemid = req.params.itemid;
  path = "/api/items/" + itemid;
  postdata = {
    itemid: itemid
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE", 
    json: postdata,
    headers: {
      'Cookie': "mineslist_token=" + req.cookies.mineslist_token + ";"
    }
  };
  if (!postdata.itemid) {
    res.redirect('/profile?remove=error');
  } else {
    request(requestOptions, function(err, response, body) {
      if(response.statusCode === 204) {
        res.redirect('/profile?remove=complete');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/profile?remove=error');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
}