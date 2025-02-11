import "dotenv/config";
import express from "express";
import router from "./routes.js";
const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
