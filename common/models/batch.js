'use strict';
const disableRemoteMethods = require('../../server/custom_modules/disableMethods/disableMethods');

module.exports = function (Batch) {
  disableRemoteMethods(Batch);
  Batch.addBatch = function (departmentId, batchDescription, cb) {
    Batch.create({ departmentId, batchDescription }).then(batchObj => {
      return cb(null, batchObj);
    }).catch(error => {
      return cb(error);
    });
  }
  Batch.getBatchByDepartmentId = function (departmentId, cb) {
    Batch.find({ departmentId }).then(batch => {
      cb(null, { batch });
    }).catch(error => {
      cb({ error });
    })
  }
  Batch.getAllBatches = function (cb) {
    Batch.find().then(batches => cb(null, { batches })).catch(error => cb({ error }));
  }
  Batch.remoteMethod('addBatch', {
    accepts: [
      { arg: "departmentId", type: "string" },
      { arg: "batchDescription", type: "string" }
    ],
    returns: { arg: "data", root: true }
  });
  Batch.remoteMethod('getBatchByDepartmentId', {
    accepts: { arg: "departmentId", type: "string" },
    returns: { arg: "data", root: true }
  });
  Batch.remoteMethod('getAllBatches', {
    accepts: [],
    returns: { arg: "data", root: true }
  });
};
