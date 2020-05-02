'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Semester) {
  disableRemoteMethods(Semester);
  Semester.addSemester = function (semesterCount, semesterDescription, cb) {
    Semester.create({ semesterCount, semesterDescription }).then(semesterObj => {
      cb(null, { result: semesterObj });
    }).catch (error => {
      cb({ error });
    })
  }
  Semester.remoteMethod ('addSemester', {
    accepts: [
      { arg: "semesterCount", type: "number" },
      { arg: "semesterDescription", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
};
