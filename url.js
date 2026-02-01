const { nanoid } = require("nanoid");
const URL = require("../model/url");


async function handleGenerateNewShrtURL(req, res) {
    const body = req.body || {};
    if (!body.url) {
        return res.status(400).json({
            error: 'url is required',
            hint: 'Send JSON body: { "url": "https://your-long-url.com" } with Content-Type: application/json'
        });
    }

    // Ensure URL has protocol so redirect works in browser (e.g. facebook.com → https://facebook.com)
    let redirectUrl = body.url.trim();
    if (!/^https?:\/\//i.test(redirectUrl)) {
        redirectUrl = 'https://' + redirectUrl;
    }

    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirecturl: redirectUrl,
        visitHistory: []
    });

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortID}`;
    return res.json({ id: shortID, shortUrl, originalUrl: redirectUrl });
}

module.exports = {
    handleGenerateNewShrtURL,
}