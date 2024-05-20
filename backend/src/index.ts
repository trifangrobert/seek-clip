import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import videoRoutes from "./routes/videoRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import setupElasticsearchIndex from "./config/elasticsearchSetup";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// middleware for parsing request body as JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/captions', express.static('captions'));
app.use('/profile-pictures', express.static('profile-pictures'));

app.use("/api/auth", authRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {

    console.log("Connected to MongoDB database successfully");

    try {
      await setupElasticsearchIndex();
      console.log("Elasticsearch index setup successfully");
    } catch (error) {
      console.error("Error setting up Elasticsearch index: ", error);
    }

    app.listen(port, () => {
      console.log(`Server running at ${process.env.BASE_URL}`);
      console.log(`Using backend-asr at: ${process.env.BACKEND_ASR_URL}`)
      console.log(`Using backend-topic at: ${process.env.BACKEND_TOPIC_URL}`)
    }
    );
  })
  .catch((error: Error) => console.log(error));
