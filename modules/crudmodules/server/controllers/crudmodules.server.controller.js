'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crudmodule = mongoose.model('Crudmodule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Crudmodule
 */
exports.create = function(req, res) {
  var crudmodule = new Crudmodule(req.body);
  crudmodule.user = req.user;

  crudmodule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(crudmodule);
    }
  });
};

/**
 * Show the current Crudmodule
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var crudmodule = req.crudmodule ? req.crudmodule.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  crudmodule.isCurrentUserOwner = req.user && crudmodule.user && crudmodule.user._id.toString() === req.user._id.toString();

  res.jsonp(crudmodule);
};

/**
 * Update a Crudmodule
 */
exports.update = function(req, res) {
  var crudmodule = req.crudmodule;

  crudmodule = _.extend(crudmodule, req.body);

  crudmodule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(crudmodule);
    }
  });
};

/**
 * Delete an Crudmodule
 */
exports.delete = function(req, res) {
  var crudmodule = req.crudmodule;

  crudmodule.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(crudmodule);
    }
  });
};

/**
 * List of Crudmodules
 */
exports.list = function(req, res) {
  Crudmodule.find().sort('-created').populate('user', 'displayName').exec(function(err, crudmodules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(crudmodules);
    }
  });
};

/**
 * Crudmodule middleware
 */
exports.crudmoduleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crudmodule is invalid'
    });
  }

  Crudmodule.findById(id).populate('user', 'displayName').exec(function (err, crudmodule) {
    if (err) {
      return next(err);
    } else if (!crudmodule) {
      return res.status(404).send({
        message: 'No Crudmodule with that identifier has been found'
      });
    }
    req.crudmodule = crudmodule;
    next();
  });
};
