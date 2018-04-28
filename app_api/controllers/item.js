var mongoose = require('mongoose');
var Items = mongoose.model('Item');
var User = mongoose.model('User');
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.postItem = function(req, res) {
  if (!req.payload.name) {
    sendJsonResponse(res, 404, {"message" : "Log in to sell items!"});
    return;
  }
  User
    .findOne({email:req.payload.email})
    .select('items')
    .exec(function(err, user) {
      if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
          user.items.push({
          name: req.body.name,
          seller: req.payload.name,
          price: req.body.price,
          description: req.body.description
          });
      
          user.save(function(err, item){
          var thisItem;
          if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
          }else {
            thisItem = user.items[user.items.length-1];
            sendJsonResponse(res,201,thisItem);
          }
          });
      }
 });
};

module.exports.deleteItem = function(req, res) {
  // console.log(req.payload);
  if (!req.payload.email || !req.params.itemid) {
    sendJsonResponse(res, 404, {"message" : "Not found, log in and item id are both required"});
    return;
  }
  User
    .find()
    .select('items _id')
    .exec(function(err, users) {
      if(!users) {
        sendJsonResponse(res, 404, {"message" : "No items found."});
        return;
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
        for(var i = 0; i < users.length; i++) {
          for(var j = 0; j < users[i].items.length; j++) {
            if(users[i].items[j]._id == req.params.itemid) {
              users[i].items.id(req.params.itemid).remove();
              users[i].save(function(err) {
                if(err) {
                  console.log(err);
                  sendJsonResponse(res, 404, err);
                } else {
                  sendJsonResponse(res, 204, null);
                }
              });
              return;
            }
          }
        }

        sendJsonResponse(res, 404, {"message": "No item with the given item id are found"});
      }
  });
}

module.exports.getItems = function(req, res) {
  User
    .find()
    .select('items _id')
    .exec(function(err, users) {
      if(!users) {
        sendJsonResponse(res, 200, {});
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
        sendJsonResponse(res, 200, users);
      }
 });
};

module.exports.getItem = function(req, res) {
  if (!req.payload.email || !req.params.itemid) {
    sendJsonResponse(res, 404, {"message" : "Not found, log in and item id are both required"});
    return;
  }
  User
    .find()
    .select('items email _id')
    .exec(function(err, users) {
      if(!users) {
        sendJsonResponse(res, 404, {"message": "Not found, log in and item id are both required"});
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
        for(var i = 0; i < users.length; i++) {
          for(var j = 0; j < users[i].items.length; j++) {
            if(users[i].items[j]._id == req.params.itemid) {
              console.log(users[i]);
              var data = {
                name: users[i].items[j].name,
                seller: users[i].items[j].seller,
                email: users[i].email,
                price: users[i].items[j].price,
                _id: users[i].items[j]._id,
                description: users[i].items[j].description
              };
              sendJsonResponse(res, 200, data);
              return;
            }
          }
        }

        sendJsonResponse(res, 404, {"message": "No item with the given item id are found"});
      }
  });
};