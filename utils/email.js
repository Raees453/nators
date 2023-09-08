const nodemailer = require('nodemailer');

exports.sendEmail = async ({
  from = 'Ali Wajdan <awp@gmail.com>',
  to,
  subject,
  text,
}) => {
  // In order to send emails using gmail enable
  // less secure app option in gmail

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const options = {
    from,
    to,
    subject,
    text,
  };

  // Send email
  return transporter.sendMail(options);
};
