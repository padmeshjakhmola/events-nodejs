import express, { Router } from "express";
import { logRequest } from "./middleware/logger.js";
import healthRoute from "./routes/health.js";
import eventRoute from "./routes/events.js";
import userRoute from "./routes/users.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(logRequest);

const baseRoute = express.Router();

baseRoute.use("/health", healthRoute);
baseRoute.use("/events", eventRoute);
baseRoute.use("/users", userRoute);

app.use("/v1", baseRoute);

app.listen(port, () => {
  console.log(`🚀 Server is up on port ${port}`);
});
