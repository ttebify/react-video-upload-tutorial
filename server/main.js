const app = require("./app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
