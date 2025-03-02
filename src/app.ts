import "dotenv/config"
import express from "express";
import router from "./routes.js";
import promClient  from "prom-client";


const app = express();
const PORT = process.env.PORT || 3002;
const URI = process.env.URI || "http://localhost";
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

app.use(express.json());
app.use("/api", router);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running at ${URI}:${PORT}`);
});
