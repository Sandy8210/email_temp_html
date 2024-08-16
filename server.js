const app = require("./app");
require("dotenv").config();

const sequelize = require("./config/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
