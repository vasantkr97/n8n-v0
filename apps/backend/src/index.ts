import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes"
import workflowRoutes from "./routes/workflow.routes"
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    console.log("hillo, hillo");
    res.send("healthy");
});

app.use("/api/auth", authRouter)

app.use("/api/workflows", workflowRoutes)

app.use("/api/credentials", )


app.listen(PORT, () => {
    console.log(`server running at http:localhost:${PORT}`)
})