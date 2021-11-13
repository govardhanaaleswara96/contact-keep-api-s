const express = require('express');
const app = express();
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const connectDB = require("./config/db");


app.use(express.json({ extened: true }));
app.get('/', (req, res) => {
    res.json({ msg: "Welcome To The ContactKeeper API..." });
})
//connect to database
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})