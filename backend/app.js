const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config/db'); // Initialize MongoDB connection
const Campaign = require('./models/campaignModel'); // adjust path if needed



const {serveSitemap} = require('./utlis/sitemapGenerator');
const submissionController = require('./controllers/submissionController');
const BASE_DOMAIN = 'https://www.orung.com';


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.post('/api/submit', submissionController.submitCampaign);
app.get('/api/credits', submissionController.getCredits);
app.get('/api/campaigns', submissionController.getCampaigns);
app.get('/api/sitemap/:campaignId', serveSitemap);

app.get('/robots.txt', async (req, res) => {
    try {
        // Fetch active campaigns (or all campaigns you want indexed)
        const campaigns = await Campaign.find({}, '_id').exec();

        // Start building robots.txt content
        let robotsTxt = `User-agent: *\nDisallow: /admin/\n`;

        // Add a Sitemap directive for each campaign
        campaigns.forEach(campaign => {
            robotsTxt += `Sitemap: ${BASE_DOMAIN}/api/sitemap/${campaign._id}\n`;
        });

        // Send as plain text
        res.type('text/plain');
        res.send(robotsTxt);

    } catch (err) {
        console.error('[robots.txt Error]', err);
        res.status(500).send('Internal server error');
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${5000}`);
});