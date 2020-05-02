'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Faculty) {
  disableRemoteMethods(Faculty);
  Faculty.addFaculty = function (firstName, middleName, lastName, departmentId, workingDays, isExamCellEmployee, highestEducation, prefix, cb) {
    Faculty.create({
      firstName, middleName, lastName, departmentId, 
      workingDays, isExamCellEmployee, highestEducation, prefix
    }).then(facultyObj => {
      cb(null, facultyObj);
    }).catch(error => {
      cb(error);
    });
  }
  Faculty.deleteFaculty = function (facultyId, cb) {
    Faculty.destroyAll(
      { where: { id: facultyId } 
    }).then(() => {
      cb(null, { success: true });
    }).catch(() => {
      cb({ success: false });
    })
  }
  Faculty.getFacultiesByDepartment = function (departmentId, cb) {
    Faculty.find({
      where: { departmentId },
      include: [{
        relation: "department",
        scope: { include: [{ relation: "departmentHod"}] }
      }]
    }).then(faculties => {
      cb(null, { faculties });
    }).catch(error => {
      cb({ error });
    });
  }
  Faculty.getFaculties = function (cb) {
    Faculty.find({ where: {}, include: [{
      relation: "department",
      scope: { include: [{ relation: "departmentHod"}] }
    }]}).then(departments => {
      cb(null, { departments });
    }).catch(error => {
      cb({ error });
    });
  }
  Faculty.remoteMethod ('addFaculty', {
    accepts: [
      { arg: "firstName", type: "string" },
      { arg: "middleName", type: "string" },
      { arg: "lastName", type: "string" },
      { arg: "departmentId", type: "string" },
      { arg: "workingDays", type: "number" },
      { arg: "isExamCellEmployee", type: "boolean" },
      { arg: "highestEducation", type: "string" },
      { arg: "prefix", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Faculty.remoteMethod ('deleteFaculty', {
    accepts: { arg: "facultyId", type: "string" },
    returns: { arg: "data", root: true }
  });
  Faculty.remoteMethod ('getFacultiesByDepartment', {
    accepts: { arg: "departmentId", type: "string" },
    returns: { arg: "data", root: true }
  });
  Faculty.remoteMethod ('getFaculties', {
    accepts: [],
    returns: { arg: 'data', root: true }
  })
};
