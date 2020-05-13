'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');
const createUser = require("../../server/custom_modules/college-user/createUser");
const loginUser = require("../../server/custom_modules/college-user/loginUser");
const editUser = require("../../server/custom_modules/college-user/editUser");
const getUserByToken = require("../../server/custom_modules/college-user/getUserByToken");
const getEmployeesByType = require("../../server/custom_modules/college-user/getEmployeesByType");

module.exports = function(Collegeuser) {
  disableRemoteMethods(Collegeuser);

  // Create User Route
  Collegeuser.createUser = function (userData, req, cb) {
    createUser(Collegeuser, userData, cb);
  }

  // Edit User Details
  Collegeuser.editUser = (userType, userData, cb) => {
    editUser(Collegeuser, userType, userData, cb);
  }

  // Login User Route
  Collegeuser.loginUser = function (email, password, userType, cb) {
    loginUser(Collegeuser, email, password, userType, cb);
  }

  // Verify exisiting token
  Collegeuser.getUserByToken = function (token, cb) {
    getUserByToken(Collegeuser, token, cb);
  }

  // Get Employees by type
  Collegeuser.getEmployeesByType = (userType, whereFilter, cb) => {
    getEmployeesByType(Collegeuser, userType, whereFilter, cb);
  }

  Collegeuser.remoteMethod('createUser', {
    accepts: [
      { arg: "userData", type: "object" },
      { arg: 'req', type: 'object', 'http': {source: 'req'} },
    ],
    returns: { arg: "data", root: true }
  });

  Collegeuser.remoteMethod('editUser', {
    accepts: [
      { arg: 'userType', type: "string" },
      { arg: 'userData', type: 'object' }
    ],
    returns: { arg: "data", root: true }
  })

  Collegeuser.remoteMethod('loginUser', {
    accepts: [
      { arg: 'email', type: 'string' },
      { arg: 'password', type: 'string' },
      { arg: 'userType', type: 'string' }
    ],
    returns: { arg: "data", root: true }
  });

  Collegeuser.remoteMethod('getUserByToken', {
    accepts: [
      { arg: "token", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

  Collegeuser.remoteMethod('getEmployeesByType', {
    accepts: [
      { arg: "userType", type: "string" },
      { arg: "whereFilter", type: "object" }
    ],
    returns: { arg: "data", root: true }
  });

};
