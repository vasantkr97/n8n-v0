import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();

app.use.apply(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    console.log("hillo, hillo");
    res.send("healthy");
});

//catch all unmactched routes;
app.use('*', (req:Request, res:Response) =>{
    res.status(404).json({
        success: false,
        msg: "Route not found"
    });
});


app.listen(PORT, () => {
    console.log(`server running at http:localhost:${PORT}`)
})