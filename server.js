const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { token, topic } = req.body;
  try {
    await admin.messaging().subscribeToTopic(token, topic);
    res.json({ success: true, message: `Subscribed to ${topic}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/unsubscribe", async (req, res) => {
  const { token, topic } = req.body;
  try {
    await admin.messaging().unsubscribeFromTopic(token, topic);
    res.json({ success: true, message: `Unsubscribed from ${topic}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("FCM Worker Running");
});

const PORT =  3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
