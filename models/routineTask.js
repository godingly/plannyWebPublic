var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoutineTaskSchema = new Schema({
    name: {type: String, required: true},
    duration: {type: Number, required: true, default: 5, min: 1},
    routine: {type: String, required: true, default: 'misc'},
    order: {type: Number, required: true}
});

// Export model.
module.exports = mongoose.model('RoutineTask', RoutineTaskSchema);