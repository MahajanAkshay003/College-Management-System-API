module.exports = (Collegeuser, email, password, userType, cb) => {
  Collegeuser.login({ email, password }, async (error, token) => {
    if (error) cb({ error: "Invalid email or password" });
    else {
      const collegeUser = await Collegeuser.findById(token.userId);
      if (userType !== collegeUser.userType) {
        cb({ error: "Invalid email or password" });
      } else {
        console.log(collegeUser);
        cb(null, { id: token.id, userType: collegeUser.userType, userId: collegeUser.userId });
      }
    }
  });
}
