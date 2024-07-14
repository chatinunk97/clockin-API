const nodemailer = require("nodemailer");
const mailbody = require("../mail/mailbody");

const nodemailerSender = (email, link) => {
  const mailBody = mailbody(
    //For Deployment
    `https://clockin-react.vercel.app/setpassword?token=${link}`

    // //For Local
    //  `http://localhost:5173/setpassword?token=${link}`
  );

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  let mailOptions = {
    from: "Cloud Clock Admin <clockinnotification1@gmail.com>",
    to: email,
    subject: "Setup your account",
    html: mailBody,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
module.exports = nodemailerSender;
