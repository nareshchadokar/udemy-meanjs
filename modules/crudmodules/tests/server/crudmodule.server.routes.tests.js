'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crudmodule = mongoose.model('Crudmodule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crudmodule;

/**
 * Crudmodule routes tests
 */
describe('Crudmodule CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Crudmodule
    user.save(function () {
      crudmodule = {
        name: 'Crudmodule name'
      };

      done();
    });
  });

  it('should be able to save a Crudmodule if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Crudmodule
        agent.post('/api/crudmodules')
          .send(crudmodule)
          .expect(200)
          .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
            // Handle Crudmodule save error
            if (crudmoduleSaveErr) {
              return done(crudmoduleSaveErr);
            }

            // Get a list of Crudmodules
            agent.get('/api/crudmodules')
              .end(function (crudmodulesGetErr, crudmodulesGetRes) {
                // Handle Crudmodules save error
                if (crudmodulesGetErr) {
                  return done(crudmodulesGetErr);
                }

                // Get Crudmodules list
                var crudmodules = crudmodulesGetRes.body;

                // Set assertions
                (crudmodules[0].user._id).should.equal(userId);
                (crudmodules[0].name).should.match('Crudmodule name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Crudmodule if not logged in', function (done) {
    agent.post('/api/crudmodules')
      .send(crudmodule)
      .expect(403)
      .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
        // Call the assertion callback
        done(crudmoduleSaveErr);
      });
  });

  it('should not be able to save an Crudmodule if no name is provided', function (done) {
    // Invalidate name field
    crudmodule.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Crudmodule
        agent.post('/api/crudmodules')
          .send(crudmodule)
          .expect(400)
          .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
            // Set message assertion
            (crudmoduleSaveRes.body.message).should.match('Please fill Crudmodule name');

            // Handle Crudmodule save error
            done(crudmoduleSaveErr);
          });
      });
  });

  it('should be able to update an Crudmodule if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Crudmodule
        agent.post('/api/crudmodules')
          .send(crudmodule)
          .expect(200)
          .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
            // Handle Crudmodule save error
            if (crudmoduleSaveErr) {
              return done(crudmoduleSaveErr);
            }

            // Update Crudmodule name
            crudmodule.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Crudmodule
            agent.put('/api/crudmodules/' + crudmoduleSaveRes.body._id)
              .send(crudmodule)
              .expect(200)
              .end(function (crudmoduleUpdateErr, crudmoduleUpdateRes) {
                // Handle Crudmodule update error
                if (crudmoduleUpdateErr) {
                  return done(crudmoduleUpdateErr);
                }

                // Set assertions
                (crudmoduleUpdateRes.body._id).should.equal(crudmoduleSaveRes.body._id);
                (crudmoduleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crudmodules if not signed in', function (done) {
    // Create new Crudmodule model instance
    var crudmoduleObj = new Crudmodule(crudmodule);

    // Save the crudmodule
    crudmoduleObj.save(function () {
      // Request Crudmodules
      request(app).get('/api/crudmodules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Crudmodule if not signed in', function (done) {
    // Create new Crudmodule model instance
    var crudmoduleObj = new Crudmodule(crudmodule);

    // Save the Crudmodule
    crudmoduleObj.save(function () {
      request(app).get('/api/crudmodules/' + crudmoduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', crudmodule.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Crudmodule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crudmodules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crudmodule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Crudmodule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Crudmodule
    request(app).get('/api/crudmodules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Crudmodule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Crudmodule if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Crudmodule
        agent.post('/api/crudmodules')
          .send(crudmodule)
          .expect(200)
          .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
            // Handle Crudmodule save error
            if (crudmoduleSaveErr) {
              return done(crudmoduleSaveErr);
            }

            // Delete an existing Crudmodule
            agent.delete('/api/crudmodules/' + crudmoduleSaveRes.body._id)
              .send(crudmodule)
              .expect(200)
              .end(function (crudmoduleDeleteErr, crudmoduleDeleteRes) {
                // Handle crudmodule error error
                if (crudmoduleDeleteErr) {
                  return done(crudmoduleDeleteErr);
                }

                // Set assertions
                (crudmoduleDeleteRes.body._id).should.equal(crudmoduleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Crudmodule if not signed in', function (done) {
    // Set Crudmodule user
    crudmodule.user = user;

    // Create new Crudmodule model instance
    var crudmoduleObj = new Crudmodule(crudmodule);

    // Save the Crudmodule
    crudmoduleObj.save(function () {
      // Try deleting Crudmodule
      request(app).delete('/api/crudmodules/' + crudmoduleObj._id)
        .expect(403)
        .end(function (crudmoduleDeleteErr, crudmoduleDeleteRes) {
          // Set message assertion
          (crudmoduleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Crudmodule error error
          done(crudmoduleDeleteErr);
        });

    });
  });

  it('should be able to get a single Crudmodule that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Crudmodule
          agent.post('/api/crudmodules')
            .send(crudmodule)
            .expect(200)
            .end(function (crudmoduleSaveErr, crudmoduleSaveRes) {
              // Handle Crudmodule save error
              if (crudmoduleSaveErr) {
                return done(crudmoduleSaveErr);
              }

              // Set assertions on new Crudmodule
              (crudmoduleSaveRes.body.name).should.equal(crudmodule.name);
              should.exist(crudmoduleSaveRes.body.user);
              should.equal(crudmoduleSaveRes.body.user._id, orphanId);

              // force the Crudmodule to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Crudmodule
                    agent.get('/api/crudmodules/' + crudmoduleSaveRes.body._id)
                      .expect(200)
                      .end(function (crudmoduleInfoErr, crudmoduleInfoRes) {
                        // Handle Crudmodule error
                        if (crudmoduleInfoErr) {
                          return done(crudmoduleInfoErr);
                        }

                        // Set assertions
                        (crudmoduleInfoRes.body._id).should.equal(crudmoduleSaveRes.body._id);
                        (crudmoduleInfoRes.body.name).should.equal(crudmodule.name);
                        should.equal(crudmoduleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Crudmodule.remove().exec(done);
    });
  });
});
