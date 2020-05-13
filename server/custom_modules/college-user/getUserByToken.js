module.exports = (Collegeuser, token, cb) => {
  const { AccessToken } = Collegeuser.app.models;
  AccessToken.findOne({
    where: { id: token }
  }).then((result) => {
    Collegeuser.findById(result.userId).then(user => {
      cb(null, { ...user.toJSON() });
    }).catch(error => {
      cb({ error });
    })
  }).catch(error => {
    cb({ error });
  })
}
