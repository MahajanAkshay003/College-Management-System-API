'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Student) {
  disableRemoteMethods(Student);
  Student.getStudentDetails = function (studentId, cb) {
    Student.findOne({
      where: { id: studentId },
      include: [
        { relation: "department", scope: { include: ["departmentHod"] } },
        "batch",
        { relation: "marks", scope: { include: ["subject"] }}
      ]
    }).then(studentObj => {
        cb(null, { student: studentObj });
    }).catch(error => {
      console.log(error);
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

  Student.getStudents = function (whereFilter, cb) {
    const currentYear = new Date().getFullYear();
    const findStudentsPromise = Student.find({
      where: { ...whereFilter, yearOfAdmission: { gte: currentYear - 4 } },
      include: [
        {
          relation: "department",
          scope: { include: [{ relation: "departmentHod" }] }
        },
        "batch", "marks"
      ]
    });
    findStudentsPromise.then(students => {
      cb(null, { students });
    }).catch(error => {
      cb({ error });
    });
  }

  Student.remoteMethod ('getStudents', {
    http: { verb: 'get' },
    accepts: [
      { arg: "whereFilter", type: "object" }
    ],
    returns: { arg: 'data', root: true }
  })

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
