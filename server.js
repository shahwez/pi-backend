import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.send("Pi Backend Running ✅");
});

// 1. Approve Payment
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

// 2. Complete Payment (The missing piece to stop the loop)
app.post("/complete-payment", async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) return res.status(400).json({ success: false, message: "Missing paymentId or txid" });

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Completion Error:", err);
    res.status(500).json({ success: false });
  }
});

// 3. Verify Payment
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