'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function(StudentQueryAnswers) {

  disableRemoteMethods(StudentQueryAnswers);

  StudentQueryAnswers.answerQuery = (studentQueryId, answer, cb) => {
    const { StudentQuery } = StudentQueryAnswers.app.models;
    StudentQueryAnswers.create({ studentQueryId, answer }).then(queryAnswer => {
      StudentQuery.upsertWithWhere({ id: studentQueryId }, { isAnswered: true })
        .then(() => {
          cb(null, { queryAnswer });
        })
        .catch(error => {
          cb({ error });
        })
    }).catch(error => {
      cb ({ error });
    })
  }

  StudentQueryAnswers.remoteMethod('answerQuery', {
    accepts: [
      { arg: "studentQueryId", type: "string" },
      { arg: "answer", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });

};
