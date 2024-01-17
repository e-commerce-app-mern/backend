import express from "express";
import { connectDB } from "./utils/features.js";
//* Import Routes
import { error } from "./middlewares/error.js";
import userRoute from "./routes/user.js";
const port = 4000;
//* DB connection
connectDB();
const app = express();
//* Middlewares
app.use(express.json());
//* Routes
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
app.use("/api/v1/user", userRoute);
//* Middleware for handling errors
app.use(error);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
