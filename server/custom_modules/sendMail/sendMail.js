const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hijikata.the.boss@gmail.com',
    pass: 'qwerty keyboard'
  }
});

module.exports = (to, subject, html) => {
  const mailOptions = {
    from: 'BVCOE Delhi', to, subject, html
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
       if (error) {
         console.log(error);
         reject(error)
       }
       else {
         console.log(info);
         resolve(info);
       }
    });
  })
}
