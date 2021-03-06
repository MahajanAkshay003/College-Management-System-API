'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(Attendance) {
  disableRemoteMethods(Attendance);
  Attendance.addFacultyAttendance = function (facultyId, date, entryTime, exitTime, isPresent, type, attendanceId, cb) {
    switch (type) {
      case "entry":
        Attendance.create({
          facultyId, attendanceDate: date, entryTime, exitTime, isPresent
        }).then (attendanceObj => {
          cb(null, { result: attendanceObj });
        }).catch (error => {
          console.log(error);
          cb({ error });
        })
        break;
      case "exit":
        Attendance.upsertWithWhere({ id: attendanceId }, { exitTime })
          .then (attendanceObj => {
            cb(null, { result: attendanceObj });
          }).catch (error => {
            console.log(error);
            cb({ error });
          });
        break;
      default:
        cb({ error: "Invalid Type" });
    }
  }
  Attendance.getAttendanceByDate = function (studentId, from, to, cb) {
    Attendance.find({
      where: {
        studentId,
        date: { between: [from, to] }
      },
      include: {
        relation: "timetable",
        scope: { include: ["subject", "faculty", "semester"] }
      }
    }).then(attendance => {
      return cb(null, { attendance });
    }).catch(error => {
      return cb({ error });
    });
  }
  Attendance.getAttendanceBySubject = function (studentId, semesterId, subjectId, year, cb) {
    const { TimeTable } = Attendance.app.models;
    const attendance = [];
    TimeTable.find({ where: { semesterId, subjectId, year } }).then(async timeTables => {
      try {
        for (let i = 0; i < timeTables.length; i++) {
          const attendanceData = await Attendance.find({
            where: { studentId, timeTableId: timeTables[i].id },
            include: ["timetable"]
          });
          attendance.push(...attendanceData);
        }
        return cb(null, { attendance });
      } catch (error) {
        console.log(error);
        return cb({ error });
      }
    }).catch(error => {
      console.log(error);
      return cb({ error });
    });
  }
  Attendance.getAttendanceBySemester = function (studentId, semesterId, year, cb) {
    const { TimeTable } = Attendance.app.models;
    const attendance = [];
    TimeTable.find({ where: { semesterId, year } }).then(async timeTables => {
      try {
        for (let i = 0; i < timeTables.length; i++) {
          const attendanceData = await Attendance.find({
            where: { studentId, timeTableId: timeTables[i].id },
            include: ["timetable"]
          });
          attendance.push(...attendanceData);
        }
        return cb(null, { attendance });
      } catch (error) {
        return cb ({ error });
      }
    }).catch (error => {
      return cb ({ error });
    })
  }
  Attendance.remoteMethod('addFacultyAttendance', {
    accepts: [
      { arg: "facultyId", type: "string" },
      { arg: "date", type: "number" },
      { arg: "entryTime", type: "string" },
      { arg: "exitTime", type: "string" },
      { arg: "isPresent", type: "boolean" },
      { arg: "type", type: "string" },
      { arg: "attendanceId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Attendance.remoteMethod('getAttendanceByDate', {
    http: { verb: 'get' },
    accepts: [
      { arg: "studentId", type: "string" },
      { arg: "from", type: "date" },
      { arg: "to", type: "date" }
    ],
    returns: { arg: "data", root: true }
  });
  Attendance.remoteMethod('getAttendanceBySubject', {
    accepts: [
      { arg: "studentId", type: "string" },
      { arg: "semesterId", type: "string" },
      { arg: "subjectId", type: "string" },
      { arg: "year", type: "string"}
    ],
    returns: { arg: "data", root: true }
  });
  Attendance.remoteMethod('getAttendanceBySemester', {
    accepts: [
      { arg: "studentId", type: "string" },
      { arg: "semesterId", type: "string" },
      { arg: "year", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
};
