import "dotenv/config"
import express from "express";
import router from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3002;
const URI = process.env.URI || "http://localhost";

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running at ${URI}:${PORT}`);
});
