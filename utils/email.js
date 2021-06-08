const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs =  require('fs');
const path = require('path');

const sendEmail = async (option) => {

    const filePath = path.join(__dirname, '../views/forgotPassword.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
        username: "Umut YEREBAKMAZ",
        temp_token:option.token,
      };
    const htmlToSend = template(replacements);

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
        html: htmlToSend// plain text body
      };

      await transporter.sendMail(mailOptions);
      console.log("Preview URL: %s", "https://mailtrap.io/inboxes/test/messages/");
}

module.exports = sendEmail