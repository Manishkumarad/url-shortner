const express = require("express");
const urlRouter = require("./route/url");
const URL = require("./model/url");
const { connectToMongooseDB } = require("./connect");

const app = express();

const PORT = 8001;

app.use(express.json());

// Serve frontend (index.html, script.js, style.css) from / on same port
app.use(express.static("public"));

connectToMongooseDB('mongodb://localhost:27017/short-url')
.then(() =>(console.log("mongoDb connected")) 
);

app.use("/url", urlRouter);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    );
    if (!entry) return res.status(404).json({ error: "Short URL not found" });
    // Ensure redirect URL has protocol (fixes old entries saved as "facebook.com")
    let target = entry.redirecturl;
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
    res.redirect(target);
});

app.listen(PORT, () => console.log(`server started at Port ${PORT}`));