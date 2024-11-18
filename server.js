const express = require('express');
const Joi = require('joi');
const cors = require('cors'); // To enable cross-origin requests if needed for local dev

const app = express();
app.use(cors()); // Enable if the client is on a different origin
app.use(express.json()); // Parse incoming JSON requests

const reviews = []; // Array to store reviews

// Joi validation schema
const reviewSchema = Joi.object({
    name: Joi.string().required(),
    stars: Joi.number().integer().min(1).max(5).required(),
    feedback: Joi.string().required(),
    date: Joi.string().required(),
});

// POST route for adding a review
app.post('/api/reviews', (req, res) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        // Send validation error response
        return res.status(400).json({ message: error.details[0].message });
    }

    // Push valid review into the array
    reviews.push(req.body);

    // Send success response
    res.status(201).json({ message: 'Review added successfully!' });
});

// GET route for retrieving all reviews
app.get('/api/reviews', (req, res) => {
    res.status(200).json(reviews);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
