import express from "express";
import cors from "cors";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cookiParser from "cookie-parser";
import dotenv from "dotenv";
import { errorMiddleware } from "./utils/error-handler/error-handler-middleware";
import authRouter from "./routes/auth.router";
import salonRouter from "./routes/salon.router";
import branchRouter from "./routes/branch.router";
import staffRouter from "./routes/staff.router";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookiParser());
app.set("trust proxy", 1);

// Apply rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req, res) => ipKeyGenerator(req.ip as string),
});

app.use(limiter);
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/api/v1/health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/salon", salonRouter);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/staff", staffRouter);

// app.use("/api/v1/user");
// app.use("/api/v1/admin");
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
