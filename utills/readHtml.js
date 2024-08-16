const fs = require("node:fs");
const path = require("path");

function readHTML(filepath, callback) {
  // Join __dirname with the provided filepath to get the full path to the file
  const htmlFilePath = path.join(__dirname, "..", "email", filepath);

  // Read the file with UTF-8 encoding
  fs.readFile(htmlFilePath, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      // Pass the error to the callback
      return callback(err);
    }
    // Pass the HTML content to the callback
    callback(null, html);
  });
}

module.exports = readHTML;
