module.exports = (Collegeuser, userData, cb) => {
  const { Student, Faculty } = Collegeuser.app.models;
  const { userCredentials, userInfo } = userData;
  let selectedUser;
  if (userCredentials.userType === "student") {
    selectedUser = Student;
  } else if (userCredentials.userType === "faculty") {
    selectedUser = Faculty;
  } else {
    return cb({ error: "Unknown user type" });
  }
  selectedUser.create(userInfo).then(newUserObj => {
    Collegeuser.create({ ...userCredentials, userTypeId: newUserObj.id }).then(userObj => {
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