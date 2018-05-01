/*(function () {
  angular
    .module('MinesList')
    .service('authentication', authentication);

  authentication.$inject = ['$window'];
  function authentication ($window) {
    var saveToken = function (token) {
      $window.localStorage['mineslist_token'] = token;
    };
    var getToken = function () {
      return $window.localStorage['mineslist_token'];
    };
    return {
      saveToken : saveToken,
      getToken : getToken
    };
  }
})();*/

var saveToken = function (token) {
  window.localStorage['mineslist_token'] = token;
};
var getToken = function () {
  return window.localStorage['mineslist_token'];
};

/*var register = function(user) {
  return $http.post('/api/register', user).success(function(data){
    saveToken(data.token);
  });
};

var login = function(user) {
  return $http.post('/api/login', user).success(function(data) {
    saveToken(data.token);
  });
};
*/
function removeTokens() {
  window.localStorage.removeItem('mineslist_token');
  window.localStorage.removeItem('user_email');
  document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'mineslist_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function logout() {
  removeTokens();
  window.location = '/';
};

var getToken = function () {
  return window.localStorage['mineslist_token'];
};

var isLoggedIn = function() {
  var token = getToken();
  if(token){
    var payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
};

var currentUser = function() {
  if(isLoggedIn()){
    var token = getToken();
    var payload = JSON.parse(window.atob(token.split('.')[1]));
    return {
      email : payload.email,
      name : payload.name
    };
  }
};