const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/db");
const generateRandomPassword = require("./utills/GendratePassword");
const sendEmail = require("./utills/sendEmail");
const readHTML = require("./utills/readHtml");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API working as Success" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const randomPassword = generateRandomPassword(12);

    const [result] = await sequelize.query(
      `INSERT INTO userData (name, email, password)
         VALUES (:name, :email, :password)
         RETURNING name, email`,
      {
        replacements: {
          name,
          email,
          password: randomPassword,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // if (result.length > 0) {
    //   const { name, email } = result[0];
    //   console.log(name);
    // }

    readHTML("passwordEmail.html", async (err, html) => {
      if (err) {
        console.error("Error reading HTML file", err);
        res.status(500).send({ error: "Failed to read HTML file" });

        return;
      }

      const htmltosend = html
        .replace("##YOUR NAME", result[0].name)
        .replace("##YOUR PASSWORD", randomPassword);

      const subject = "Your Password";

      try {
        await sendEmail({
          subject,
          email,
          message: htmltosend,
        });
        res.status(200).json({
          success: true,
          message: "User registered successfully and email sent successfully",
          data: result,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        res.status(500).json({
          success: false,
          message: "User registered successfully but failed to send email",
        });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the user",
    });
  }
});

module.exports = app;
