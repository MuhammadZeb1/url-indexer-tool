import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  url: String,
  status: { type: String, default: "pending" }
});

const campaignSchema = new mongoose.Schema({
  name: String,
  urls: [urlSchema],
  totalUrls: Number,
  creditsUsed: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Campaign", campaignSchema);
