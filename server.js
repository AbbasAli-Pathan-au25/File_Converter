const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();
li = [];
output_li = [];

app.use(fileUpload());

//Route to upload a file, read the text and covert it into a json file
app.post("/upload", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  await file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } else {
      fs.readFile(
        `${__dirname}/client/public/uploads/${file.name}`,
        "utf-8",
        (err, data) => {
          file_data = data.split(" - ").join("~,~").split("\r\n");

          file_data.forEach((fd) => {
            li.push(fd.split("~,~"));
          });

          li.forEach((oli) => {
            var obj = {
              timestamp: "",
              loglevel: "",
              transactionId: "",
              err: "",
            };

            obj.timestamp = oli[0];
            obj.loglevel = oli[1];
            var obj2 = JSON.parse(oli[2]);
            obj.transactionId = obj2.transactionId;
            obj.err =
              obj2.err === undefined || obj2.err === null
                ? "Not found"
                : obj2.err;
            output_li.push(obj);
          });

          fs.writeFile("./output.json", JSON.stringify(output_li), (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Sucess");
            }
          });
        }
      );
    }
  });
});

//Route to dowload the json file
app.get("/download", (req, res) => {
  res.download("./output.json");
});

app.listen(5000, () => console.log("Server Started..."));
