const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({
  subject,
  fromMail = process.env.EMAIL,
  email,
  message,
  attachment,
}) {
  const mailOptions = {
    from: fromMail,
    to: email,
    subject: subject,
    html: message,
    attachments: attachment,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
}

// const sendEmailController = async (req, res) => {
//   const { subject, email, message, attachment } = req.body;

//   console.log("----------------------", subject, email, message);

//   if (!subject || !email || !message) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields are required",
//     });
//   }

//   sendEmail({
//     subject,
//     email,
//     message,
//     attachment,
//   })
//     .then(() => {
//       return res.status(200).json({
//         success: true,
//         message: "Email process complete",
//       });
//     })
//     .catch((error) => {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send email",
//         error: error.message,
//       });
//     });
// };

module.exports = sendEmail;
