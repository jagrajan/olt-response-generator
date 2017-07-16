var mongoose = require('mongoose');

var snippetSchema = mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    public: {type: Boolean, default: false},
    type: {type: String, enum: ['snippet', 'stockphrase', 'template'], default: 'stockphrase'},
    title: {type: String},
    content: {type: String}
});

var Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;