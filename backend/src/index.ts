// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// middleware for parsing request body as JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", userRoutes);


mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB database successfully");
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((error: Error) => console.log(error));
