import express, { Router } from "express";
import { logRequest } from "./middleware/logger.js";
import healthRoute from "./routes/health.js";
import eventRoute from "./routes/events.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(logRequest);

const baseRoute = express.Router();

baseRoute.use("/health", healthRoute);
baseRoute.use("/events", eventRoute);

app.use("/v1", baseRoute);

app.listen(port, () => {
  console.log(`🚀 Server is up on port ${port}`);
});
