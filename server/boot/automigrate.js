// module.exports = server => {
//   var ds = server.dataSources.mongoDb;
//   var lbTables = ['TimeTable', 'Attendance', 'Batch', 'CollegeUser', 'Department', 'Faculty', 'Marks', 'Semester', 'Student', 'Subject'];
//   ds.automigrate(["Subject"], function(er) {
//     if (er) throw er;
//     console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
//     ds.disconnect();
//   });
// }
