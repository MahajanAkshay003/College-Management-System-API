'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(TnpEmployee) {

  disableRemoteMethods(TnpEmployee);

};
