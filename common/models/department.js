'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function (Department) {
  disableRemoteMethods(Department);
  Department.addDepartment = function (departmentName, departmentHodId, departmentDescription, cb) {
    Department.create({ departmentName, departmentHodId, departmentDescription }).then(departmentObj => {
      return cb (null, { department: departmentObj });
    }).catch(error => {
      return cb (error);
    });
  }
  Department.getDepartments = function (cb) {
    Department.find({}).then(departments => {
      return cb (null, { departments });
    }).catch(error => {
      return cb({ error });
    })
  }
  Department.getDepartmentById = function (departmentId, cb) {
    Department.findById(departmentId).then(department => {
      return cb(null, { department });
    }).catch(error => {
      return cb({ error });
    })
  }
  Department.addHod = function (departmentId, facultyId, cb) {
    Department.upsertWithWhere({ id: departmentId }, { departmentHodId: facultyId }).then(departmentObj => {
      return cb(null, { department: departmentObj });
    }).catch(error => {
      return cb({ error });
    })
  }
  Department.updateDepartmentById = function (departmentObj, cb) {
    Department.upsertWithWhere({ id: departmentObj.id }, departmentObj).then(department => {
      return cb(null, { department });
    }).catch(error => {
      return cb({ error });
    });
  }
  Department.remoteMethod('addDepartment', {
    accepts: [
      { arg: "departmentName", type: "string" },
      { arg: "departmentHodId", type: "string" },
      { arg: "departmentDescription", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Department.remoteMethod('getDepartments', {
    http: { verb: 'get' },
    accepts: [],
    returns: { arg: "data", root: true }
  });
  Department.remoteMethod('addHod', {
    accepts: [
      { arg: "departmentId", type: "string" },
      { arg: "facultyId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Department.remoteMethod('updateDepartmentById', {
    accepts: [
      { arg: 'departmentObj', type: 'object', required: true, http: {source: 'body'} },
      { arg: 'req', type: 'object', 'http': {source: 'req'} },
    ],
    returns: { arg: "data", root: true }
  })
};
