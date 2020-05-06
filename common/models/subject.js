'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Subject) {
  disableRemoteMethods(Subject);
  Subject.addSubject = function (id, semester, subjectName, subjectDescription, credits, subjectType, departmentId, cb) {
    console.log(id, semester, subjectName, subjectDescription, credits, subjectType, departmentId);
    Subject.create({ subjectId: id, semester, subjectName, subjectDescription, credits, subjectType, departmentId }).then(subjectObj => {
      cb(null, { subject: subjectObj });
    }).catch(error => {
      console.log(error);
      cb({ error });
    });
  }
  Subject.getSubjectsBySemesterAndDepartment = function (semester, departmentId, cb) {
    Subject.find({
      where: { semester, departmentId },
      include: ["department"]
    }).then(subjects => {
      cb(null, { subjects });
    }).catch(error => {
      cb({ error });
    });
  }
  Subject.remoteMethod ('addSubject', {
    accepts: [
      { arg: "id", type: "string" },
      { arg: "semester", type: "string" },
      { arg: "subjectName", type: "string" },
      { arg: "subjectDescription", type: "string" },
      { arg: "credits", type: "string" },
      { arg: "subjectType", type: "string" },
      { arg: "departmentId", type: "string" },
    ],
    returns: { arg: "data", root: true }
  });
  Subject.remoteMethod ('getSubjectsBySemesterAndDepartment', {
    accepts: [
      { arg: "semester", type: "string" },
      { arg: "departmentId", type: "string"}
    ],
    returns: { arg: "data", root: true }
  })
};
