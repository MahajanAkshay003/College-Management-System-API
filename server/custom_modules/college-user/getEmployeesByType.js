module.exports = (CollegeUser, userType, whereFilter, cb) => {
  const { Student, Faculty, ExamCellEmployee, AdminEmployee, TnpEmployee } = CollegeUser.app.models;
  let selectedUser;
  if (userType === "student") {
    selectedUser = Student;
  } else if (userType === "faculty") {
    selectedUser = Faculty;
  } else if (userType === "examcell") {
    selectedUser = ExamCellEmployee
  } else if (userType === "admin") {
    selectedUser = AdminEmployee;
  } else if (userType === "tnp") {
    selectedUser = TnpEmployee;
  } else {
    return cb({ error: "Unknown user type" });
  }
  selectedUser.find({ where: whereFilter }).then(employees => {
    cb(null, { employees });
  }).catch(error => {
    cb({ error });
  })
}
