var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: {type: String, required: true},
    lists: [{type: Schema.ObjectId, ref: 'List'}]
});
// ProjectSchema.plugin(require('mongoose-autopopulate'));

// Virtual for this genre instance URL.
ProjectSchema
.virtual('url')
.get(function () {
  return '/project/'+this._id;
});

// Export model.
module.exports = mongoose.model('Project', ProjectSchema);