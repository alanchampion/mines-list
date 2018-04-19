var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  seller: {type: Date, required: true},
  price: {type: Number, required: true},
  description:{type: String, required: false}
});

mongoose.model('Item', itemSchema);