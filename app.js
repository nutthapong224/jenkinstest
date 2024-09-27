const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser"); // Add body-parser to handle form data

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware for parsing JSON and setting EJS as the view engine
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data

app.set("view engine", "ejs");

// Define a schema and model for demonstration
const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", itemSchema);

// Route to render the EJS template with data from MongoDB
app.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    console.log("Items:", items); // Log the items to check if data is being fetched correctly
    res.render("index", { items });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Server Error");
  }
});

// Route to render the form page for creating a new item
app.get("/create", (req, res) => {
  res.render("create"); // Ensure 'create' corresponds to create.ejs in the views folder
});

app.post("/create", async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body to verify data
  const { name } = req.body;

  try {
    const newItem = new Item({ name });
    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.error("Failed to create item:", err);
    res.status(500).send("Failed to create item");
  }
});


// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
