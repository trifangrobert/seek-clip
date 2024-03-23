// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import videoRoutes from "./routes/video";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// middleware for parsing request body as JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", userRoutes);
app.use("/api/video", videoRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB database successfully");
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((error: Error) => console.log(error));
