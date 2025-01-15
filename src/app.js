const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3002

app.use(express.json())
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
