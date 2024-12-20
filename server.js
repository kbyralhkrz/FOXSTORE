const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// اتصال بـ MongoDB
mongoose.connect("mongodb://localhost:27017/fox-gaming", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// نموذج المستخدم
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

// تسجيل المستخدم
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(400).json({ error: "User registration failed." });
    }
});

// تسجيل الدخول
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
        res.json({ token, username: user.username, balance: user.balance });
    } else {
        res.status(400).json({ error: "Invalid credentials." });
    }
});

// تحديث الرصيد
app.post("/update-balance", async (req, res) => {
    const { token, amount } = req.body;

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        const user = await User.findById(decoded.id);

        if (user) {
            user.balance += amount;
            await user.save();
            res.json({ balance: user.balance });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid token." });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});