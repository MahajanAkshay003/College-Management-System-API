'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Marks) {
  disableRemoteMethods(Marks);
  Marks.addMarks = function (studentId, semesterId, subjectId, externalMarks, internalExamMarks, internalExtraMarks, cb) {
    Marks.create({studentId, semesterId, subjectId, externalMarks, internalExamMarks, internalExtraMarks}).then (marksObj => {
      cb(null, { result: marksObj });
    }).catch (error => {
      cb({ error });
    })
  }
  Marks.remoteMethod('addMarks', {
    accepts: [
      { arg: "studentId", type: "string" },
      { arg: "semesterId", type: "string" },
      { arg: "subjectId", type: "string" },
      { arg: "externalMarks", type: "number" },
      { arg: "internalExamMarks", type: "number" },
      { arg: "internalExtraMarks", type: "number" }
    ],
    returns: { arg: "data", root: true }
  });
};
