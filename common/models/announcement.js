'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');
const sendMail = require("../../server/custom_modules/sendMail/sendMail");

module.exports = function(Announcement) {

  disableRemoteMethods(Announcement);

  Announcement.sendAnnouncement = (subject, description, studentId, senderId, senderType, cb) => {
    const { AnnouncementStudentMapping, Student } = Announcement.app.models;
    Announcement.create({ subject, description, senderId, senderType }).then(announcementObj => {
      AnnouncementStudentMapping.create({ announcementId: announcementObj.id, studentId }).then(() => {
        Student.findById(studentId).then(studentData => {
          const { email } = studentData;
          const html = `
            <h4>You have received an announcement. Please read below.</h4>
            <p><b>${subject}</b></p>
            <p>${description}</p>
          `;
          sendMail(email, "An Announcement has been posted", html).then(() => {
            cb(null, { announcement: announcementObj });
          }).catch(error => {
            cb(null, { announcement: announcementObj });
          });
        });
      })
    }).catch(error => {
      cb({ error });
    })
  }

  Announcement.getStudentAnnouncements = (studentId, cb) => {
    const { AnnouncementStudentMapping } = Announcement.app.models;
    AnnouncementStudentMapping.find({ where: { studentId }, include: [{
      relation: "announcement",
      scope: {
        include: ["faculty", "tnp", "examCell"]
      }
    }] }).then(announcements => {
      cb(null, { announcements });
    }).catch(error => {
      cb({ error });
    })
  }

  Announcement.getEmployeeAnnouncements = (id, userType, cb) => {
    switch (userType) {
      case "faculty":
        Announcement.find({ where: { senderType: { neq: userType } }, include: ["faculty", "examCell", "tnp", "admin"] }).then(announcements => {
          cb(null, { announcements });
        }).catch(error => {
          cb({ error });
        });
        break;
      case "admin":
      case "examcell":
      case "tnp":
        Announcement.find({ where: { senderType: "admin" }, include: ["faculty", "examCell", "tnp", "admin"] }).then(announcements => {
          cb(null, { announcements });
        }).catch(error => {
          cb({ error });
        });
        break;
      default:
        cb({ error: "Unknown User Type" });
    }
  }

  Announcement.getSentAnnouncementsByIdAndType = (userId, userType, cb) => {
    Announcement.find({ where: { senderId: userId, senderType: userType }, include: ["faculty", "examCell", "tnp", "admin"] }).then(announcements => {
      cb(null, { announcements });
    }).catch(error => {
      cb({ error });
    })
  }

  Announcement.sendMail = (studentId, subject, description, cb) => {
    const { Student } = Announcement.app.models;
    Student.findById(studentId).then(studentData => {
      const { email } = studentData;
      const html = `
            <h4>You have received an announcement. Please read below.</h4>
            <p><b>${subject}</b></p>
            <p>${description}</p>
          `;
      sendMail(email, "Email Alert", html).then(() => {
        cb(null, { success: "Email Sent Successfully!" });
      }).catch(error => {
        cb(null, { error });
      });
    });
  }

  Announcement.remoteMethod("sendAnnouncement", {
    accepts: [
      { arg: "subject", type: "string" },
      { arg: "description", type: "string" },
      { arg: "studentId", type: "string" },
      { arg: "senderId", type: "string" },
      { arg: "senderType", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

  Announcement.remoteMethod("getStudentAnnouncements", {
    http: { verb: 'get' },
    accepts: [
      { arg: "studentId", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

  Announcement.remoteMethod("getEmployeeAnnouncements", {
    http: { verb: 'get' },
    accepts: [
      { arg: "id", type: "string" },
      { arg: "userType", type: "string" }
    ],
    returns: { arg: "data", root: true }
  })

  Announcement.remoteMethod("getSentAnnouncementsByIdAndType", {
    http: { verb: 'get' },
    accepts: [
      { arg: "userId", type: "string" },
      { arg: "userType", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

  Announcement.remoteMethod("sendMail", {
    http: { verb: "post" },
    accepts: [
      { arg: "studentId", type: "string" },
      { arg: "subject", type: "string" },
      { arg: "description", type: "string" }
    ],
    returns: { arg: "data", root: true }
  })

};


