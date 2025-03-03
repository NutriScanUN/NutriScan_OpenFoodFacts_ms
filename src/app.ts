import "dotenv/config"
import express from "express";
import router from "./routes.js";
import promClient  from "prom-client";


const app = express();
const PORT = process.env.PORT || 3002;
const URI = process.env.URI || "http://localhost";

const register = promClient.register;
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de las solicitudes HTTP en segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5] // Intervalos de tiempo en segundos
});
register.registerMetric(httpRequestDurationMicroseconds );

const cacheRequests = new promClient.Counter({
  name: "user_api_cache_total",
  help: "Total de requests al cache",
  labelNames: ["instance", "type"]
});

register.registerMetric(cacheRequests);

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status_code'],
});

// Simulación: Incrementar contador cuando se consulta caché
app.get("/cache", (req, res) => {
  cacheRequests.inc({ instance: "user-api", type: "Request" });
  res.json({ message: "Cache request counted" });
});

app.use(express.json());
app.use("/api", router);


app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    httpRequestTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running at ${URI}:${PORT}`);
});
