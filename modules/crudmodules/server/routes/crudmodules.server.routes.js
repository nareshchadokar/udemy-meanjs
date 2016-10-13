'use strict';

/**
 * Module dependencies
 */
var crudmodulesPolicy = require('../policies/crudmodules.server.policy'),
  crudmodules = require('../controllers/crudmodules.server.controller');

module.exports = function(app) {
  // Crudmodules Routes
  app.route('/api/crudmodules').all(crudmodulesPolicy.isAllowed)
    .get(crudmodules.list)
    .post(crudmodules.create);

  app.route('/api/crudmodules/:crudmoduleId').all(crudmodulesPolicy.isAllowed)
    .get(crudmodules.read)
    .put(crudmodules.update)
    .delete(crudmodules.delete);

  // Finish by binding the Crudmodule middleware
  app.param('crudmoduleId', crudmodules.crudmoduleByID);
};
