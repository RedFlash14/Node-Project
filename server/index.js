const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];
let sessions = {};
let students = {};

const generateToken = () => Math.random().toString(36).substring(2);

// Sign up
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "Signup successful" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken();
  sessions[token] = username;
  if (!students[username]) students[username] = [];
  res.json({ token });
});

// Logout
app.post("/logout", (req, res) => {
  const { token } = req.body;
  delete sessions[token];
  res.json({ message: "Logged out" });
});

// Add student
app.post("/students", (req, res) => {
  const { token, firstName, lastName, course, batch } = req.body;
  const username = sessions[token];
  if (!username) return res.status(401).json({ message: "Unauthorized" });

  students[username].push({ firstName, lastName, course, batch });
  res.json({ message: "Student added" });
});

// Get students
app.get("/students", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const username = sessions[token];
  if (!username) return res.status(401).json({ message: "Unauthorized" });

  res.json(students[username]);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
