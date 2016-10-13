'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crudmodule Schema
 */
var CrudmoduleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Crudmodule name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Crudmodule', CrudmoduleSchema);
