$('#addReview').submit(function (e) {
  $('.alert.alert-danger').hide();
  if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if ($('.alert.alert-danger').length) {
      $('.alert.alert-danger').show();
    } else {
      $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
    }
    return false;
  }
});

var saveToken = function (token) {
  window.localStorage['mineslist_token'] = token;
};

$(document).ready(function() {
  var metas = document.getElementsByTagName('meta');
  for(var i=0; i < metas.length; i++) {
    if(metas[i].getAttribute("names") == "authentication") {
      saveToken(metas[i].getAttribute("content"));
    }
  }
});