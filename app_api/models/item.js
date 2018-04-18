var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  /*name: {type: String, required: true},
  due: {type: Date, required: true},
  value: {type: Number, required: true},
  status: {type: String, "default": "Not started"}*/
});

mongoose.model('Item', itemSchema);