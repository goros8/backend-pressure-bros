const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors()); // Enable if the client is on a different origin
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static("public")); // Serve static files

// MongoDB Connection
mongoose
  .connect("mongodb+srv://Wf8eIemWV9E3tf6f:Wf8eIemWV9E3tf6f@pressure-bros.jw2zc.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Couldn't connect to MongoDB", error));

// MongoDB Schema and Model for Reviews
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
  date: { type: String, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

// Validation Schema (Using Joi)
const validateReview = (review) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    stars: Joi.number().integer().min(1).max(5).required(),
    feedback: Joi.string().required(),
    date: Joi.string().required(),
  });

  return schema.validate(review);
};

// Routes

// Serve Front-End Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET: Retrieve All Reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews from the database
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
});

// POST: Add a New Review
app.post("/api/reviews", async (req, res) => {
  const { error } = validateReview(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const review = new Review(req.body); // Create a new review
    const savedReview = await review.save(); // Save it to the database
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error saving review", error });
  }
});

// DELETE: Remove a Review by ID
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(deletedReview);
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// PUT: Update a Review by ID
app.put("/api/reviews/:id", async (req, res) => {
  const { error } = validateReview(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and validate fields
    );
    if (!updatedReview) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
