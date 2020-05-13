'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Marks) {
  disableRemoteMethods(Marks);
  Marks.addMarks = function (studentId, semester, subjectId, externalMarks, internalExamMarks, internalExtraMarks, cb) {
    Marks.create({studentId, semester, subjectId, externalMarks, internalExamMarks, internalExtraMarks}).then (marksObj => {
      cb(null, { result: marksObj });
    }).catch (error => {
      cb({ error });
    })
  }

  Marks.updateMarks = function (id, studentId, semester, subjectId, externalMarks, internalExamMarks, internalExtraMarks, cb) {
    console.log(id, studentId, semester, subjectId, externalMarks, internalExamMarks, internalExtraMarks);
    Marks.upsertWithWhere(
      { id },
      { studentId, semester, subjectId, externalMarks, internalExamMarks, internalExtraMarks }
    ).then(marksObj => {
      cb(null, { result: marksObj })
    }).catch(error => {
      cb({ error });
    })
  }

  Marks.remoteMethod('addMarks', {
    accepts: [
      { arg: "studentId", type: "any" },
      { arg: "semester", type: "any" },
      { arg: "subjectId", type: "any" },
      { arg: "externalMarks", type: "any" },
      { arg: "internalExamMarks", type: "any" },
      { arg: "internalExtraMarks", type: "any" }
    ],
    returns: { arg: "data", root: true }
  });

  Marks.remoteMethod('updateMarks', {
    accepts: [
      { arg: "id", type: "any" },
      { arg: "studentId", type: "any" },
      { arg: "semester", type: "any" },
      { arg: "subjectId", type: "any" },
      { arg: "externalMarks", type: "any" },
      { arg: "internalExamMarks", type: "any" },
      { arg: "internalExtraMarks", type: "any" }
    ],
    returns: { arg: "data", root: true }
  });

};
