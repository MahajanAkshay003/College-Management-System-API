'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Student) {
  disableRemoteMethods(Student);
  Student.getStudentDetails = function (studentId, cb) {
    Student.findOne({
      where: { id: studentId },
      include: [{ relation: "department", scope: { include: ["departmentHod"] } }, "batch", "semester"]
    }).then(studentObj => {
      const { semesterId, departmentId, batchId, yearOfAdmission } = studentObj;
      const { Subject, TimeTable } = Student.app.models;
      Subject.find({ where: { departmentId, semesterId } }).then(async subjects => {
        const timeTable = {};
        for (let i = 0; i < subjects.length; i++) {
          const subject = subjects[i];
          const subjectId = subject.id;
          const subjectTimeTables = await TimeTable.find({
            where: { semesterId, batchId, subjectId, year: yearOfAdmission },
            order: "startTime ASC"
          });
          for (let j = 0; j < subjectTimeTables.length; j++) {
            const subjectTimeTable = subjectTimeTables[j];
            if (timeTable[subjectTimeTable.day]) timeTable[subjectTimeTable.day].push(subjectTimeTable)
            else timeTable[subjectTimeTable.day] = [subjectTimeTable];
          }
        }
        cb(null, { student: studentObj, subjects, timeTable });
      });
    }).catch(error => {
      return cb({ error });
    });
  }
  Student.addStudent = function (rollNumber, userType, firstName, middleName,
                                 lastName, yearOfAdmission, departmentId, batchId,
                                 semesterId, email, currentAddress, permanentAddress,
                                 fatherFirstName, fatherMiddleName, fatherLastName,
                                 motherFirstName, motherMiddleName, motherLastName,
                                 outsideDelhi, ipuRank, cb) {

  }
  Student.remoteMethod ('addStudent', {
    accepts: [
      { arg: "rollNumber", type: "string" },
      { arg: "userType", type: "string" },
      { arg: "firstName", type: "string" },
      { arg: "middleName", type: "string" },
      { arg: "lastName", type: "string" },
      { arg: "yearOfAdmission", type: "number" },
      { arg: "departmentId", type: "string" },
      { arg: "batchId", type: "string" },
      { arg: "semesterId", type: "string" },
      { arg: "email", type: "string" },
      { arg: "currentAddress", type: "string" },
      { arg: "permanentAddress", type: "string" },
      { arg: "fatherFirstName", type: "string" },
      { arg: "fatherMiddleName", type: "string" },
      { arg: "fatherLastName", type: "string" },
      { arg: "motherFirstName", type: "string" },
      { arg: "motherMiddleName", type: "string" },
      { arg: "motherLastName", type: "string" },
      { arg: "outsideDelhi", type: "boolean" },
      { arg: "ipuRank", type: "string" }
    ],
    http: { verb: 'post' },
    returns: { arg: "data", root: true }
  });
  Student.remoteMethod ('getStudentDetails', {
    accepts: [
      { arg: "studentId", type: "string" }
    ],
    http: { verb: 'get' },
    returns: { arg: "data", root: true }
  });
};
