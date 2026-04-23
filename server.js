import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // 1. Added CORS

const app = express();
app.use(cors()); // 2. Enable CORS so the game can talk to the server
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY || "YOUR_KEY_HERE";

// Health check
app.get("/", (req, res) => {
  res.send("Pi Backend Running ✅");
});

// 🔥 NEW: Approve Payment (The missing piece!)
app.post("/approve-payment", async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ success: false });

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Approval Error:", err);
    res.status(500).json({ success: false });
  }
});

// 🔥 Verify Payment
app.post("/verify-payment", async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ success: false });

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: "GET",
      headers: { "Authorization": `Key ${PI_API_KEY}` }
    });
    const data = await response.json();
    
    if (data.status === "COMPLETED") {
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
