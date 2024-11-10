const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>{
    res.send("hello world");
});
app.get("/api/reviews", (req, res) =>{
    const reviews = [
        {
            "reviews":[
                {
                    "date": "2024-10-01",
                    "stars": 5,
                    "user": "Alice Johnson",
                    "review": "Outstanding service! My driveway looks brand new. Highly recommend!"
                },
                {
                    "date": "2024-10-02",
                    "stars": 4,
                    "user": "Bob Smith",
                    "review": "Did a great job on the patio, but I wish they had cleaned the edges better."
                },
                {
                    "date": "2024-10-03",
                    "stars": 3,
                    "user": "Charlie Brown",
                    "review": "The service was decent, but the team was a bit late to arrive."
                },
                {
                    "date": "2024-10-04",
                    "stars": 2,
                    "user": "Diana Prince",
                    "review": "Not very impressed. Some areas were still dirty after they left."
                },
                {
                    "date": "2024-10-05",
                    "stars": 1,
                    "user": "Eve Adams",
                    "review": "Completely dissatisfied. They damaged my fence while pressure washing."
                }
            ]
            }
    ];
    res.send(reviews);
});
app.listen(3000, () => {
    console.log("im listening");
});