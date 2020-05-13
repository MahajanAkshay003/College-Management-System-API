module.exports = (CollegeUser, userType, userData, cb) => {
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
  selectedUser
    .upsertWithWhere({ id: userData.id }, userData)
    .then(() => {
      cb(null, { message: "User updated successfully!" });
    })
    .catch(error => {
      cb({ error });
    });
}
