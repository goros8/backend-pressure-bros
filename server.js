const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect("mongodb+srv://Wf8eIemWV9E3tf6f:Wf8eIemWV9E3tf6f@pressure-bros.jw2zc.mongodb.net/?retryWrites=true&w=majority&appName=pressure-bros")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Couldn't connect to MongoDB", error));

// Data Storage (In-memory for simplicity)
const reviews = [];

// Joi Validation Schema
const reviewSchema = Joi.object({
  name: Joi.string().required(),
  stars: Joi.number().integer().min(1).max(5).required(),
  feedback: Joi.string().required(),
  date: Joi.string().required(),
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET: Retrieve All Reviews
app.get("/api/reviews", (req, res) => {
  res.status(200).json(reviews);
});

// POST: Add a Review
app.post("/api/reviews", (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  reviews.push(req.body);
  console.log("Review added:", req.body);
  res.status(201).json(reviews);
});

// DELETE: Delete a Review by ID
app.delete("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 0 || id >= reviews.length) {
    return res.status(404).json({ message: "Review not found" });
  }

  reviews.splice(id, 1);
  res.status(200).json(reviews);
});

// PUT: Update a Review by ID
app.put("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 0 || id >= reviews.length) {
    return res.status(404).json({ message: "Review not found" });
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  reviews[id] = req.body;
  res.status(200).json(reviews);
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
