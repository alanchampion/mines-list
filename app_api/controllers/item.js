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
    .findOne({email:req.payload.email})
    .select('items')
    .exec(function(err, user) {
      if(!user) {
        sendJsonResponse(res, 404, {"message" : "User not found."});
        return;
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } 
      if(user.items && user.items.length > 0) {
        if(!user.items.id(req.params.itemid)) {
          sendJsonResponse(res, 404, {"message" : "item id not found"});
        } else {
          user.items.id(req.params.itemid).remove();
          user.save(function(err) {
            if(err) {
              console.log(err);
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 204, null);
            }
          });
        }
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
    .findOne({email:req.payload.email})
    .select('items _id')
    .exec(function(err, user) {
      if(!user) {
        sendJsonResponse(res, 404, {"message": "Not found, log in and item id are both required"});
      } else if(err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
        if(user.items && user.items.length > 0) {
          thisItem = user.items.id(req.params.itemid);
          if(!thisItem) {
            sendJsonResponse(res, 404, {"message" : "item id not found"});
          } else {
            var data = {
              name: thisItem.name,
              seller: thisItem.seller,
              email: req.payload.email,
              price: thisItem.price,
              _id: thisItem._id,
              description: thisItem.description
            };
            sendJsonResponse(res, 200, data);
          }
        } else {
          sendJsonResponse(res, 404, {"message" : "No item found"});
        }
      }
 });
};