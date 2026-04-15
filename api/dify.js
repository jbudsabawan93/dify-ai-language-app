module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!process.env.DIFY_API_KEY) {
        return res.status(500).json({ error: "Missing DIFY_API_KEY" });
    }

    try {
        const { word } = req.body || {};
        if (!word) {
            return res.status(400).json({ error: "word is required" });
        }

        const difyRes = await fetch("https://api.dify.ai/v1/workflows/run", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: { word },
                response_mode: "blocking",
                user: "web-user",
            }),
        });

        const data = await difyRes.json();
        return res.status(difyRes.status).json(data);
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            detail: String(error && error.message ? error.message : error),
        });
    }
};
