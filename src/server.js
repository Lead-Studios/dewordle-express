require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const statsRoutes = require("./routes/statsRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/stats", statsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));