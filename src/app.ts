import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { i18nMiddleware } from "./middleware/i18n";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.cors.allowedOrigins,
    credentials: true,
  })
);
app.use(morgan(env.isDev ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(i18nMiddleware);

app.use("/v1", routes);

app.use(errorHandler);

export default app;
