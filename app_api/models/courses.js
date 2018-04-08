var mongoose = require('mongoose');

var assignmentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  due: {type: Date, required: true},
  value: {type: Number, required: true},
  status: {type: String, "default": "Not started"}
});

mongoose.model('Assignment', assignmentSchema);

var classesSchema = new mongoose.Schema({
  name: {type: String, required: true},
  id: {type: String, required: true},
  instructor: {type: String, required: true},
  credits: {type: Number, required: true, min: 0, max: 5},
  location: {type: String, required: true},
  assignments: [assignmentSchema]
});

mongoose.model('Class', classesSchema);