const express = require("express");
const app = express();

require("dotenv").config();

/* ImageKit SDK initialization */
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/* Express Middleware */
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* Routes */
app.get("/auth", async (req, res, next) => {
  await imagekit.getCustomMetadataFields(
    { includeDeleted: false },
    async function (error, result) {
      if (error) {
        console.log(error, "Error getting metadata");
      } else {
        const fields = result;

        const descriptionField = fields.find(
          (field) => field.name === "description"
        );

        if (!descriptionField) {
          await imagekit.createCustomMetadataField(
            {
              name: "description",
              label: "Description",
              schema: {
                type: "Text",
                isValueRequired: false,
              },
            },
            function (err, result) {
              if (err) {
                console.log(err, "Error creating metadata field");
              } else {
                console.log(result, "Metadata fields");
              }
            }
          );
        }
      }
    }
  );

  res.send(imagekit.getAuthenticationParameters());
});

module.exports = app;
