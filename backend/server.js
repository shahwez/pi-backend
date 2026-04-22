import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔐 API key from Render ENV
const PI_API_KEY = process.env.PI_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.send("Pi Backend Running ✅");
});

// ✅ STEP 1: Approve payment
app.post("/approve-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ success: false });
  }
});

// ✅ STEP 2: Verify payment
app.post("/verify-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.get(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    if (response.data.status === "COMPLETED") {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ success: false });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));