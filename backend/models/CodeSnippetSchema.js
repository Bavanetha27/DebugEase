const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
