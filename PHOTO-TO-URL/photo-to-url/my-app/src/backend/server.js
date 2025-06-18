// const express = require("express");
// require("dotenv").config();
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/images-db", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Mongoose schema
// const imageSchema = new mongoose.Schema({
//   imageURL: String,
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Image = mongoose.model("Image", imageSchema);

// // POST route to store Cloudinary URL
// app.post("/upload", async (req, res) => {
//   const { imageURL } = req.body;

//   try {
//     const newImage = new Image({ imageURL });
//     await newImage.save();
//     res.status(200).json({ message: "Image URL saved to MongoDB!" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to save to DB" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🌐 Cloudinary configuration using .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔗 MongoDB connection using env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 📦 Mongoose schema
const imageSchema = new mongoose.Schema({
  imageURL: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

// 📤 POST route to store Cloudinary URL
app.post("/upload", async (req, res) => {
  const { imageURL } = req.body;

  try {
    const newImage = new Image({ imageURL });
    await newImage.save();
    res.status(200).json({ message: "Image URL saved to MongoDB!" });
  } catch (err) {
    console.error("Error saving to MongoDB:", err);
    res.status(500).json({ error: "Failed to save to DB" });
  }
});

// ✅ Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
