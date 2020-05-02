'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');
const createUser = require("../../server/custom_modules/college-user/createUser");
const loginUser = require("../../server/custom_modules/college-user/loginUser");

module.exports = function(Collegeuser) {
  disableRemoteMethods(Collegeuser);
  // Create User Route
  Collegeuser.createUser = function (userData, req, cb) {
    createUser(Collegeuser, userData, cb);
  }
  // Login User Route
  Collegeuser.loginUser = function (email, password, userType, cb) {
    loginUser(Collegeuser, email, password, userType, cb);
  }
  Collegeuser.remoteMethod('createUser', {
    accepts: [
      { arg: 'userData', type: 'object', required: true, http: {source: 'body'} },
      { arg: 'req', type: 'object', 'http': {source: 'req'} },
    ],
    returns: { arg: "data", root: true }
  });
  Collegeuser.remoteMethod('loginUser', {
    accepts: [
      { arg: 'email', type: 'string' },
      { arg: 'password', type: 'string' },
      { arg: 'userType', type: 'string' }
    ],
    returns: { arg: "data", root: true }
  });
};
