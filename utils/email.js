const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    console.log(option);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: process.env.MAIL_ID,
               pass: process.env.MAIL_PASSWORD
           }
       });
    
       const mailOptions = {
        from: 'instaclone854@gmail.com', // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        html: `<p>${option.token}</p>`// plain text body
      };

      await transporter.sendMail(mailOptions);
}

module.exports = sendEmail