import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { logger, httpLogStream } from "./config/logger";
import { i18nMiddleware } from "./middleware/i18n";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app: Express = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = env.cors.allowedOrigins;
    if (env.isDev || allowed === '*' || (Array.isArray(allowed) && allowed.includes('*'))) {
      return callback(null, true);
    }
    if (Array.isArray(allowed) && allowed.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: httpLogStream }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(i18nMiddleware);

app.use("/v1", routes);

app.use(errorHandler);

logger.info(`App initialized — env: ${env.nodeEnv}`);

export default app;
