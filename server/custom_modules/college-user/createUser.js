module.exports = (Collegeuser, userData, cb) => {
  const { Student, Faculty, ExamCellEmployee, AdminEmployee, TnpEmployee } = Collegeuser.app.models;
  const { userCredentials, userInfo } = userData;
  let selectedUser;
  if (userCredentials.userType === "student") {
    selectedUser = Student;
  } else if (userCredentials.userType === "faculty") {
    selectedUser = Faculty;
  } else if (userCredentials.userType === "examcell") {
    selectedUser = ExamCellEmployee
  } else if (userCredentials.userType === "admin") {
    selectedUser = AdminEmployee;
  } else if (userCredentials.userType === "tnp") {
    selectedUser = TnpEmployee;
  } else {
    return cb({ error: "Unknown user type" });
  }
  let fullName;
  if (userInfo.middleName !== "") fullName = `${userInfo.firstName} ${userInfo.middleName} ${userInfo.lastName}`;
  else fullName = `${userInfo.firstName} ${userInfo.lastName}`;
  userInfo.fullName = fullName;
  selectedUser.create({ ...userInfo, email: userCredentials.email }).then(newUserObj => {
    Collegeuser.create({ ...userCredentials, userId: newUserObj.id }).then(userObj => {
      cb(null, {
        userData: newUserObj,
        userBasicInfo: userObj
      });
    }).catch(error => {
      console.log(error);
      cb(error);
    });
  }).catch(error => {
    console.log(error);
    cb(error);
  });
}
