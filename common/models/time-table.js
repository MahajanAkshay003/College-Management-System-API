'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Timetable) {
  disableRemoteMethods(Timetable);
  Timetable.addTimetable = function (
    startTime, endTime, day, semesterId, batchId, facultyId, subjectId, year, cb
  ) {
    Timetable.create({ 
      startTime, endTime, day, semesterId, batchId, facultyId, subjectId, year
    }).then (timetableObj => {
      cb(null, { result: timetableObj });
    }).catch (error => {
      cb({ error });
    })
  }
  Timetable.remoteMethod('addTimetable', {
    accepts: [
      { arg: "startTime", type: "string" },
      { arg: "endTime", type: "string" },
      { arg: "day", type: "string" },
      { arg: "semesterId", type: "string" },
      { arg: "batchId", type: "string" },
      { arg: "facultyId", type: "string" },
      { arg: "subjectId", type: "string" },
      { arg: "year", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
};
