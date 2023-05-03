var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    list: {type: Schema.ObjectId, ref: 'List', required: true, default:'Misc'},
    project: {type: Schema.ObjectId, ref: 'project', required: true, default:'Misc'},
    start_datetime: {type: Date},
    end_datetime: {type: Date},
    origin: {type: String},
    trello_id: {type: String}
});
// TaskSchema.plugin(require('mongoose-autopopulate'));

TaskSchema
.virtual('url')
.get(function () {
  return '/task/'+this._id;
});

// Export model.
module.exports = mongoose.model('Task', TaskSchema);