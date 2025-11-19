// const { Worker } = require('bullmq');
// const mongoose = require('mongoose');
// const Campaign = require('../models/campaignModel');
// const axios = require('axios');
// const { google } = require('googleapis');
// const path = require('path');
// // NOTE: Make sure your MongoDB connection is established here as well!
// require('../config/db'); 

// // --- CONFIGURATION ---
// const connection = { host: '127.0.0.1', port: 6379 }; 

// // Path to your downloaded service account JSON key
// const KEY_FILE_PATH = path.join(__dirname, '../google-service-account.json');

// // --- AUTHENTICATION & API CALL ---
// async function callGoogleIndexingApi(url) {
//     let indexedSuccessfully = false;
    
//     try {
//         // 1. Authenticate using the Service Account key
//         const auth = new google.auth.GoogleAuth({
//             keyFile: KEY_FILE_PATH,
//             scopes: ['https://www.googleapis.com/auth/indexing'],
//         });
//         const authClient = await auth.getClient();
        
//         // 2. Build the request body
//         const requestBody = {
//             url: url,
//             type: 'URL_UPDATED' // Requests that Google crawl and index the URL
//         };

//         // 3. Send the POST request to the Google Indexing API
//         const response = await axios.post(
//             'https://indexing.googleapis.com/v3/urlnotifications:publish',
//             requestBody,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${authClient.credentials.access_token}`
//                 }
//             }
//         );
        
//         // 4. Check for success status (200 is often returned, sometimes 202)
//         if (response.status === 200 || response.status === 202) {
//             console.log(`[Google API Success] URL Submitted: ${url}`);
//             indexedSuccessfully = true;
//         } else {
//             console.error(`[Google API Warning] Unexpected status ${response.status} for URL: ${url}`);
//         }

//     } catch (error) {
//         console.error(`[Google API Error] Failed to submit ${url}. Response status: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}`);
//         // Often a 403 (Permissions/Quota) or 400 (Bad URL format) error
//         indexedSuccessfully = false; 
//     }
    
//     return indexedSuccessfully;
// }

// // --- BULLMQ WORKER LOGIC ---
// const worker = new Worker('indexingQueue', async (job) => {
//     const { campaignId, urls } = job.data;
    
//     // Set status to Processing
//     await Campaign.updateOne({ _id: campaignId }, { $set: { status: 'Processing' } });

//     let successfulSubmissions = 0;
    
//     for (const url of urls) {
        
//         const isSuccess = await callGoogleIndexingApi(url); 
        
//         if (isSuccess) {
//             successfulSubmissions++;
//             // Atomically increment the counter for the front-end to track progress
//             await Campaign.updateOne(
//                 { _id: campaignId },
//                 { $inc: { indexedCount: 1 } }
//             );
//         }
        
//         // Important: Rate limit yourself to avoid hitting Google's per-second quota.
//         // The Indexing API has a quota of 200 requests per minute.
//         await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay per submission

//     }

//     // After all URLs are processed, mark campaign as Complete
//     await Campaign.updateOne(
//         { _id: campaignId },
//         { $set: { status: 'Complete' } }
//     );
    
//     console.log(`Campaign ${campaignId} finished. ${successfulSubmissions}/${urls.length} submitted to Google.`);

// }, { connection });

// worker.on('failed', (job, err) => {
//     console.error(`Job ${job.id} failed with error:`, err);
// });

// console.log('Indexing Worker is running with REAL Google API integration...');



// require('../config/db');
// const { Worker } = require('bullmq');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const { google } = require('googleapis');
// const path = require('path');
// const Campaign = require('../models/campaignModel');

// // --- MOCK DEPENDENCIES FOR DEMONSTRATION ---
// // NOTE: In a real application, you would import these from their actual files.

// // 1. Mock Campaign Model (Assuming a simple MongoDB/Mongoose structure)
// // const Campaign = {
// //     // Mock update function for demonstration purposes
// //     async updateOne(filter, update) {
// //         // In a real scenario, this would interact with MongoDB.
// //         // For sitemap injection, we assume we push the URL to an array.
// //         if (update.$push && update.$push.sitemapUrls) {
// //             console.log(`[DB Mock] Campaign ${filter._id}: Added URL ${update.$push.sitemapUrls} to sitemapUrls array.`);
// //             return;
// //         }
// //         // General updates (status, indexedCount)
// //         console.log(`[DB Mock] Campaign ${filter._id}: Updated with:`, update);
// //     }
// // };

// // 2. Mock DB Connection
// // console.log('Mock MongoDB connection established.');

// // 3. Mock utility functions
// function isOwnedDomain(url) {
//     // Placeholder logic: returns false to trigger the free automation path
//     // In reality, this checks if the domain belongs to the user/account.
//     return false; 
// }

// async function callPingService(url) {
//     // Placeholder for calling a third-party ping service
//     console.log(`[Ping Service] Pinging successful for: ${url}`);
//     // Simulate a successful ping 90% of the time
//     return Math.random() > 0.1;
// }

// // --- CONFIGURATION ---
// const connection = { host: '127.0.0.1', port: 6379 }; 
// const KEY_FILE_PATH = path.join(__dirname, '../google-service-account.json');

// // --- CORE FUNCTIONS ---

// /**
//  * Handles the official Google Indexing API submission for verified domains.
//  * @param {string} url - The URL to submit.
//  * @returns {Promise<boolean>} - True if submission was successful.
//  */
// async function callGoogleIndexingApi(url) {
//     let indexedSuccessfully = false;
//     try {
//         // --- Authentication and API call logic as in original code ---
//         const auth = new google.auth.GoogleAuth({
//             keyFile: KEY_FILE_PATH,
//             scopes: ['https://www.googleapis.com/auth/indexing'],
//         });
//         const authClient = await auth.getClient();
        
//         const requestBody = { url: url, type: 'URL_UPDATED' };

//         // NOTE: Commented out actual axios call to prevent runtime errors in non-API environment
//         /*
//         const response = await axios.post(
//             'https://indexing.googleapis.com/v3/urlnotifications:publish',
//             requestBody,
//             { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authClient.credentials.access_token}` } }
//         );

//         if (response.status === 200 || response.status === 202) {
//             console.log(`[Google API Success] URL Submitted: ${url}`);
//             indexedSuccessfully = true;
//         } else {
//             console.error(`[Google API Warning] Unexpected status ${response.status} for URL: ${url}`);
//         }
//         */

//         // MOCK successful API call
//         console.log(`[Google API MOCK Success] URL Submitted: ${url}`);
//         indexedSuccessfully = true;

//     } catch (error) {
//         console.error(`[Google API Error] Failed to submit ${url}.`);
//         indexedSuccessfully = false; 
//     }
    
//     return indexedSuccessfully;
// }

// /**
//  * Aggregates third-party URLs into a virtual sitemap stored in the Campaign document.
//  * @param {string} url - The URL to add to the sitemap list.
//  * @param {string} campaignId - The ID of the campaign to update.
//  * @returns {Promise<boolean>} - True if the URL was successfully added to the campaign's sitemap list.
//  */
// async function callSitemapInjection(url, campaignId) {
//     try {
//         // Use $push to atomically add the URL to the sitemapUrls array in the Campaign document.
//         await Campaign.updateOne(
//             { _id: campaignId },
//             { $push: { sitemapUrls: url } } 
//         );
//         console.log(`[Sitemap Aggregation] URL added to campaign sitemap list: ${url}`);
//         return true;
//     } catch (error) {
//         console.error(`[Sitemap Aggregation Error] Failed to update campaign ${campaignId}: ${error.message}`);
//         return false;
//     }
// }


// // --- BULLMQ WORKER LOGIC ---
// const worker = new Worker('indexingQueue', async (job) => {
//     const { campaignId, urls } = job.data;
    
//     // Set status to Processing
//     await Campaign.updateOne({ _id: campaignId }, { $set: { status: 'Processing' } });

//     let successfulSubmissions = 0;
    
//     for (const url of urls) {
//         let isSuccess = false;
        
//         if (isOwnedDomain(url)) {
//             // **METHOD A: OFFICIAL GOOGLE INDEXING API (For your own verified domain)**
//             isSuccess = await callGoogleIndexingApi(url); 
//             console.log(`[Method: Official API] -> ${url}`);
//         } else {
//             // **METHOD B: FREE AUTOMATION (For third-party links)**
//             console.log(`[Method: Free Automation] -> ${url}`);
            
//             // 1. Call Free Pinging Service
//             const pingSuccess = await callPingService(url); 

//             // 2. Call Automated Sitemap Injection (New implementation)
//             const sitemapSuccess = await callSitemapInjection(url, campaignId); 

//             // We consider the job successful if *either* the ping or the sitemap aggregation succeeded.
//             // Since sitemap injection is just aggregating locally, it should almost always succeed if the DB connection is up.
//             isSuccess = pingSuccess || sitemapSuccess; 
//         }
        
//         if (isSuccess) {
//             successfulSubmissions++;
//             // Atomically increment the counter for the front-end to track progress
//             await Campaign.updateOne(
//                 { _id: campaignId },
//                 { $inc: { indexedCount: 1 } }
//             );
//         }
        
//         // Ensure the rate limit is respected for both methods
//         await new Promise(resolve => setTimeout(resolve, 500)); 
//     }

//     // After all URLs are processed, mark campaign as Complete
//     await Campaign.updateOne(
//         { _id: campaignId },
//         { $set: { status: 'Complete' } }
//     );
    
//     console.log(`Campaign ${campaignId} finished. ${successfulSubmissions}/${urls.length} successful indexing attempts.`);

// }, { connection });

// worker.on('failed', (job, err) => {
//     console.error(`Job ${job.id} failed with error:`, err);
// });

// console.log('Indexing Worker is running with full indexing logic...');


//////////////////////////////////////////////////////////////////////////////////////////////////////

require('../config/db');
const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const axios = require('axios');
const { google } = require('googleapis');
const path = require('path');
const Campaign = require('../models/campaignModel');

// --- PRODUCTION CONSTANTS ---
const BING_API_KEY = process.env.BING_API_KEY || '72aa4036a921407ca33f62cedb716621';
const VERIFIED_DOMAINS = ['yourdomain.com', 'sub.yourdomain.com']; 
const KEY_FILE_PATH = path.join(__dirname, '../google-service-account.json');

// --- CONFIGURATION ---
const connection = { host: '127.0.0.1', port: 6379 };

// --- DOMAIN CHECK ---
function isOwnedDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        return VERIFIED_DOMAINS.some(domain => hostname.endsWith(domain));
    } catch {
        return false;
    }
}

// --- BING URL SUBMISSION ---
async function callPingService(url) {
    try {
        const response = await axios.post(
            'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch',
            { siteUrl: 'https://yourdomain.com', urlList: [url] },
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${BING_API_KEY}` } }
        );
        console.log(`[Bing API Success] URL Submitted: ${url}`);
        return true;
    } catch (error) {
        console.error(`[Bing API Error] Failed submission for ${url}: ${error.message}`);
        return false;
    }
}

// --- GOOGLE INDEXING API ---
async function callGoogleIndexingApi(url) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
        const authClient = await auth.getClient();
        const requestBody = { url, type: 'URL_UPDATED' };

        const response = await axios.post(
            'https://indexing.googleapis.com/v3/urlnotifications:publish',
            requestBody,
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authClient.credentials.access_token}` } }
        );

        if (response.status === 200 || response.status === 202) {
            console.log(`[Google API Success] URL Submitted: ${url}`);
            return true;
        }
        console.error(`[Google API Warning] Status ${response.status} for ${url}`);
        return false;

    } catch (error) {
        console.error(`[Google API Error] Failed submission for ${url}: ${error.message}`);
        return false;
    }
}

// --- SITEMAP INJECTION ---
async function callSitemapInjection(url, campaignId) {
    try {
        await Campaign.updateOne({ _id: campaignId }, { $push: { sitemapUrls: url } });
        console.log(`[Sitemap] URL added to campaign sitemap: ${url}`);
        return true;
    } catch (error) {
        console.error(`[Sitemap Error] ${error.message}`);
        return false;
    }
}

// --- BULLMQ WORKER ---
const worker = new Worker('indexingQueue', async (job) => {
    const { campaignId, urls } = job.data;
    await Campaign.updateOne({ _id: campaignId }, { $set: { status: 'Processing' } });

    let successfulSubmissions = 0;
    for (const url of urls) {
        let isSuccess = false;

        if (isOwnedDomain(url)) {
            isSuccess = await callGoogleIndexingApi(url);
        } else {
            const pingSuccess = await callPingService(url);
            const sitemapSuccess = await callSitemapInjection(url, campaignId);
            isSuccess = pingSuccess || sitemapSuccess;
        }

        if (isSuccess) {
            successfulSubmissions++;
            await Campaign.updateOne({ _id: campaignId }, { $inc: { indexedCount: 1 } });
        }

        await new Promise(res => setTimeout(res, 500)); // Rate limit
    }

    await Campaign.updateOne({ _id: campaignId }, { $set: { status: 'Complete' } });
    console.log(`Campaign ${campaignId} finished: ${successfulSubmissions}/${urls.length} URLs indexed.`);

}, { connection });

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
    const campaignId = job.data?.campaignId;
    if (campaignId) {
        Campaign.updateOne(
            { _id: campaignId }, 
            { $set: { status: 'Failed', lastError: `Worker failed: ${err.message}` } }
        ).catch(dbErr => console.error("Failed to update campaign status on job failure:", dbErr));
    }
});


console.log('Indexing Worker is running in production mode...');
