'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Subject) {
  disableRemoteMethods(Subject);
  Subject.addSubject = function (semesterId, subjectName, subjectDescription, credits, subjectType, departmentId, cb) {
    Subject.create({ semesterId, subjectName, subjectDescription, credits, subjectType, departmentId }).then(subjectObj => {
      cb(null, { subject: subjectObj });
    }).catch(error => {
      cb({ error });
    });
  }
  Subject.getSubjectsBySemesterAndDepartment = function (semesterId, departmentId, cb) {
    Subject.find({ 
      where: { semesterId, departmentId },
      include: ["semester", "department"]
    }).then(subjects => {
      cb(null, { subjects });
    }).catch(error => {
      cb({ error });
    });
  }
  Subject.remoteMethod ('addSubject', {
    accepts: [
      { arg: "semesterId", type: "string" },
      { arg: "subjectName", type: "string" },
      { arg: "subjectDescription", type: "string" },
      { arg: "credits", type: "number" },
      { arg: "subjectType", type: "string" },
      { arg: "departmentId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Subject.remoteMethod ('getSubjectsBySemesterAndDepartment', {
    accepts: [
      { arg: "semesterId", type: "string" },
      { arg: "departmentId", type: "string"}
    ],
    returns: { arg: "data", root: true }
  })
};
