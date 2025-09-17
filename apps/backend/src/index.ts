import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes"
import workflowRoutes from "./routes/workflow.routes";
import credentialsRoutes from "./routes/credentials.routes";
import executionRoutes from "./routes/execution.routes";

const PORT = process.env.PORT || 4000;

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  ], // Allow both common Vite ports
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    console.log("hillo, hillo");
    res.send("healthy");
});

app.use("/api/auth", authRouter);

app.use("/api/workflows", workflowRoutes);

app.use("/api/credentials", credentialsRoutes);

app.use("/api/executions", executionRoutes);


app.listen(PORT, () => {
    console.log(`server running at http:localhost:${PORT}`)
})