import Campaign from "../model/Campaign.js";
import { useCredits, getCredits } from "../utils/credits.js";
import { indexingQueue } from "../app.js";

export const createCampaign = async (req, res) => {
  const { name, urls } = req.body;
  if (!name || !urls?.length) return res.status(400).json({ message: "Invalid input" });

  if (!useCredits(urls.length)) return res.status(400).json({ message: "Not enough credits" });

  const campaign = new Campaign({
    name,
    urls: urls.map(u => ({ url: u })),
    totalUrls: urls.length,
    creditsUsed: urls.length
  });

  await campaign.save();
  indexingQueue.add({ urls, campaignId: campaign._id.toString() });

  res.json({
    campaignId: campaign._id,
    totalUrls: urls.length,
    creditsUsed: urls.length,
    remainingCredits: getCredits()
  });
};

export const getCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });

  const completed = campaign.urls.filter(u => u.status === "completed").length;
  const pending = campaign.urls.filter(u => u.status === "pending").length;

  res.json({
    campaignId: campaign._id,
    campaignName: campaign.name,
    totalUrls: campaign.totalUrls,
    progress: `${Math.floor((completed / campaign.totalUrls) * 100)}%`,
    completed,
    pending,
    urls: campaign.urls
  });
};

export const getCreditsAPI = (req, res) => {
  res.json({ remainingCredits: getCredits() });
};
