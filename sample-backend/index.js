const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();
const port = 1234;

app.use(express.json());
app.use(cors);

app.get("/__track", (req, res) => {
  console.log("Received request: ", JSON.stringify(req.query));
  res.send("Received!");
});

app.post("/__track", (req, res) => {
  console.log("Received request: ", JSON.stringify(req.body));
  res.send("Received!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
