const express = require("express");
const mongoose = require("mongoose");
const path = require("path");


const app = express();
app.use(express.json());


const cors = require("cors");
app.use(cors({
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


console.log("Serving file from:", path.join(__dirname, "public", "difficult.html"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "difficult.html"));
});


// Connect to MongoDB
mongoose.connect("mongodb://mongoadmin:AezXvo%3A70@67.231.28.54:27017/", { dbName: "difficult" })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));


const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    experience: { type: Number, default: 0 }
});


const User = mongoose.model("User", userSchema);




// Update XP Route
app.post("/update/XP", async (req, res) => {
  const { username, difficulty } = req.body;
  console.log("Received request to update XP", req.body);

  if (!username || !difficulty) {
    return res.status(400).json({ error: "Missing username or difficulty" });
  }

  const expPoints = 10; // Always give 10 XP

  try {
    console.log(`Updating XP for ${username}, Difficulty: ${difficulty}, XP to add: ${expPoints}`);

    let user = await User.findOneAndUpdate(
      { username },
      { $inc: { experience: expPoints } },
      { new: true, upsert: true }
    );

    console.log("Updated user data:", user);

    res.json({
      message: "EXP Updated!",
      user,
      difficulty,
    });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});


// Get user experience points
app.get("/user/:username", async (req, res) => {
    const { username } = req.params;


    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ experience: user.experience });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


// Start the server
const PORT = 2080;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port 2080`));





