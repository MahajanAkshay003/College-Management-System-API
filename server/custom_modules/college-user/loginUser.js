module.exports = (Collegeuser, email, password, userType, cb) => {
  const { Student, Faculty } = Collegeuser.app.models;
  Collegeuser.login({ email, password }, async (error, token) => {
    if (error) cb({ error: "Invalid email or password" });
    else {
      let userInfo;
      const { userId } = token;
      const collegeUser = await Collegeuser.findById(userId);

      if (userType !== collegeUser.userType) {
        cb({ error: "Invalid email or password" });
      } else {
        switch (collegeUser.userType) {
          case "faculty":
            const facultyInstance = await Faculty.findById(collegeUser.userId);
            userInfo = {
              id: facultyInstance.id,
              firstName: facultyInstance.firstName,
              middleName: facultyInstance.middleName,
              lastName: facultyInstance.lastName,
              fullName: facultyInstance.fullName,
              departmentId: facultyInstance.departmentId,
              workingDays: facultyInstance.workingDays,
              isExamCellEmployee: facultyInstance.isExamCellEmployee,
              highestEducation: facultyInstance.highestEducation,
              prefix: facultyInstance.prefix
            }
            return cb(null, { userInfo });
          case "student":
            const studentInstance = await Student.findById(collegeUser.userId);
            userInfo = {
              id: studentInstance.id,
              email,
              rollNumber: studentInstance.rollNumber,
              firstName: studentInstance.firstName,
              middleName: studentInstance.middleName,
              lastName: studentInstance.lastName,
              fullName: studentInstance.fullName,
              yearOfAdmission: studentInstance.yearOfAdmission,
              departmentId: studentInstance.departmentId,
              batchId: studentInstance.batchId,
              semesterId: studentInstance.semesterId,
              outsideDelhi: studentInstance.outsideDelhi,
              ipuRank: studentInstance.ipuRank
            }
            const userAddressInfo = {
              currentAddress: studentInstance.currentAddress,
              permanentAddress: studentInstance.permanentAddress
            }
            const parentDetails = {
              fatherDetails: {
                fatherFirstName: studentInstance.fatherFirstName,
                fatherMiddleName: studentInstance.fatherMiddleName,
                fatherLastName: studentInstance.fatherLastName
              },
              motherDetails: {
                motherFirstName: studentInstance.motherFirstName,
                motherMiddleName: studentInstance.motherMiddleName,
                motherLastName: studentInstance.motherLastName
              }
            }
            return cb(null, {
              userInfo,
              userAddressInfo,
              parentDetails
            });
          default:
            return cb({ error: "Something went wrong!" })
        }
      }
    }
  });
}
