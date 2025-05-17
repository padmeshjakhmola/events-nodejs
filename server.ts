import express, { Router } from "express";
import { logRequest } from "./middleware/logger.js";
import healthRoute from "./routes/health.js";
import eventRoute from "./routes/events.js";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(logRequest);
app.use(cookieParser());

const baseRoute = express.Router();

baseRoute.use("/health", healthRoute);
baseRoute.use("/events", eventRoute);
baseRoute.use("/users", userRoute);
baseRoute.use("/me", authRoute);

app.use("/v1", baseRoute);

app.listen(port, () => {
  console.log(`🚀 Server is up on port ${port}`);
});
