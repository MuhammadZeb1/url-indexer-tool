import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import Queue from "bull";

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/campaign", campaignRoutes);

// Bull Queue
export const indexingQueue = new Queue("indexingQueue", {
  redis: { host: "127.0.0.1", port: 6379 }
});

indexingQueue.process(async job => {
  const { urls } = job.data;
  const { submitToIndexNow } = await import("./queue/indexNowWorker.js");

  for (const url of urls) {
    await submitToIndexNow(url);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
