module.exports = (Collegeuser, email, password, userType, cb) => {
  Collegeuser.login({ email, password }, async (error, token) => {
    if (error) cb({ error: "Invalid email or password" });
    else {
      const { userId } = token;
      const collegeUser = await Collegeuser.findById(userId);
      if (userType !== collegeUser.userType) {
        cb({ error: "Invalid email or password" });
      } else {
        cb(null, { ...token.toJSON(), userType: collegeUser.userType });
      }
    }
  });
}
