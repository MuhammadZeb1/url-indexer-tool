import axios from "axios";

export const submitToIndexNow = async (url) => {
  const payload = {
    host: "yourdomain.com",
    key: "YOUR_INDEXNOW_KEY",
    keyLocation: "https://yourdomain.com/YOUR_INDEXNOW_KEY.txt",
    urlList: [url]
  };

  try {
    const res = await axios.post("https://api.indexnow.org/indexnow", payload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`Indexed: ${url}`);
    return res.data;
  } catch (err) {
    console.error("IndexNow Error:", err.message);
    return null;
  }
};
