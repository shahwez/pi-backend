import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔐 IMPORTANT: paste your Pi API key BELOW (only on your computer)
const PI_API_KEY = process.env.PI_API_KEY || "jxauu8rfvdb8vqojbss9uohhajm6ecyqcspjcfjdoxg9k0vkvqqk3npdffbvzu4j
";

// Health check
app.get("/", (req, res) => {
  res.send("Pi Backend Running ✅");
});

// 🔥 Verify Payment
app.post("/verify-payment", async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ success: false, error: "Missing paymentId" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Key ${PI_API_KEY}`
      }
    });

    const data = await response.json();

    if (data.status === "COMPLETED") {
      return res.json({ success: true });
    }

    return res.json({ success: false });

  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ success: false });
  }
});

// Required for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
