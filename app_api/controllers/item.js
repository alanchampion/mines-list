var mongoose = require('mongoose');
var Items = mongoose.model('Item');
var User = mongoose.model('User');
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

/*
module.exports.getItems = function(req, res) {
}
module.exports.getItem = function(req, res) {
}
module.exports.deleteAssignment = function(req, res){
    
}*/

module.exports.postItem = function(req, res) {
   /* Items.exec(function(err,item){

    item.push({
        name: req.body.name,
        seller: req.body.seller,
        price: req.body.price,
        description: req.body.description
    });
   item.save(function(err, item){
        var thisItem;
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else {
            thisItem = items[items.length-1];
            sendJsonResponse(res,201,thisItem);
        }
    });
    });
    */
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
                seller: req.body.seller,
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

