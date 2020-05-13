'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(StudentQuery) {

  disableRemoteMethods(StudentQuery);

  StudentQuery.getQueriesByStudentId = (studentId, cb) => {
    StudentQuery.find({
      where: { studentId },
      include: ["answers", "faculty"]
    }).then(queries => {
      cb(null, { queries });
    }).catch(error => {
      cb({ error });
    })
  }

  StudentQuery.getFacultyQueries = (facultyId, cb) => {
    StudentQuery.find({
      where: { facultyId },
      include: ["answers", "student"]
    }).then(queries => {
      cb(null, { queries });
    }).catch(error => {
      cb({ error });
    })
  }

  StudentQuery.askQuery = (facultyId, studentId, questionTitle, questionDescription, cb) => {
    StudentQuery.create({ facultyId, studentId, questionTitle, questionDescription })
      .then(query => {
        cb(null, { query });
      }).catch(error => {
        cb({ error });
      })
  }

  StudentQuery.remoteMethod("getQueriesByStudentId", {
    accepts: [
      { arg: "studentId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

  StudentQuery.remoteMethod("getFacultyQueries", {
    accepts: [
      { arg: "facultyId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });


  StudentQuery.remoteMethod("askQuery", {
    accepts: [
      { arg: "facultyId", type: "string" },
      { arg: "studentId", type: "string" },
      { arg: "questionTitle", type: "string" },
      { arg: "questionDescription", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

};
