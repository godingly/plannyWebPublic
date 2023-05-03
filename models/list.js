var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ListSchema = new Schema({
    name: {type: String, required: true},
    project: {type: Schema.ObjectId, ref: 'Project'},
    tasks: [{type: Schema.ObjectId, ref: 'Task'}]
});
// ListSchema.plugin(require('mongoose-autopopulate'));

ListSchema
.virtual('url')
.get(function () {
  return '/list/'+this._id;
});

// Export model.
module.exports = mongoose.model('List', ListSchema);