const nodemailer = require('nodemailer')
const nodemailerSender = (email , link)=>{

    const mailBody = `
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
      <h1 style="color: #007BFF;">Welcome to Our Platform</h1>
      <p style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #fff; border-radius: 5px;">Hello there,</p>
      <p style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #fff; border-radius: 5px;">We're excited to have you as a member of our platform. Please set your password by clicking the button below:</p>
      <a href="http://localhost:5173/setpassword?token=${link}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Set Password</a>
      <p style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #fff; border-radius: 5px;">If you did not request this, please ignore this email.</p>
      <p style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #fff; border-radius: 5px;">Thank you!</p>
    </div>
    `

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });
      let mailOptions = {
        from: "Admin Tester <clockinnotification1@gmail.com>",
        to: email,
        subject: 'Nodemailer Project',
        html: mailBody
      };
      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });
}
module.exports = nodemailerSender