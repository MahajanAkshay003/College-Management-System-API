'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Student) {
  disableRemoteMethods(Student);
  Student.getStudentDetails = function (studentId, cb) {
    Student.findOne({
      where: { id: studentId },
      include: [{ relation: "department", scope: { include: ["departmentHod"] } }, "batch"]
    }).then(studentObj => {
      const { semester, departmentId, batchId, yearOfAdmission } = studentObj;
      const { Subject, TimeTable } = Student.app.models;
      Subject.find({ where: { departmentId, semester } }).then(subjects => {
        cb(null, { student: studentObj, subjects });
      });
    }).catch(error => {
      return cb({ error });
    });
  }
  Student.getStudentByRollNumber = function (rollNumber, cb) {
    Student.findOne({
      where: { rollNumber },
      include: [{ relation: "department", scope: { include: ["departmentHod"] } }, "batch"]
    }).then(studentObj => {
      const { semester, departmentId } = studentObj;
      const { Subject, CollegeUser } = Student.app.models;
      CollegeUser.findOne({ userId: studentObj.id }).then(currentStudent => {
        studentObj.email = currentStudent.email;
        Subject.find({ where: { departmentId, semester } }).then(subjects => {
          cb(null, { student: studentObj, subjects });
        });
      });
    }).catch(error => {
      return cb({ error });
    });
  }

  Student.remoteMethod ('getStudentByRollNumber', {
    accepts: [{ arg: "rollNumber", type: "string" }],
    http: { verb: 'get' },
    returns: { arg: "data", root: true }
  });

  Student.remoteMethod ('getStudentDetails', {
    accepts: [{ arg: "studentId", type: "string" }],
    http: { verb: 'get' },
    returns: { arg: "data", root: true }
  });
};
