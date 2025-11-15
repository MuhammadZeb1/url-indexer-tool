import express from "express";
import { createCampaign, getCampaign, getCreditsAPI } from "../controller/campaignController.js";
// import { createCampaign, getCampaign, getCreditsAPI } from "../controller/campaignController.js";

const router = express.Router();

router.post("/", createCampaign);
router.get("/:id", getCampaign);
router.get("/credits/all", getCreditsAPI);

export default router;
