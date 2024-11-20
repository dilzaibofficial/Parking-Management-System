const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // localhost
    user: process.env.DB_USER,       // root
    password: process.env.DB_PASSWORD, // Empty password or null
    database: process.env.DB_NAME    // parkingManagementSystem
  });


  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
    } else {
      console.log("Connected to MySQL!");
    }
  });

// User Registration Route
app.post("/api/auth/signup", (req, res) => {
  const { first_name, last_name, email, password, phone, address, birth_date } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const query = "INSERT INTO users (first_name, last_name, email, password, phone, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [first_name, last_name, email, hashedPassword, phone, address, birth_date], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(201).json({ message: "User registered successfully!" });
    });
  });
});

// User Login Route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.json({ message: "Login successful" });
  });
});


app.get('/api/parking-lots', (req, res) => {
    const query = 'SELECT * FROM parking_lots';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      res.status(200).json(results);
    });
  });
  

  // Example Route for User Login (POST request)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      if (results.length > 0) {
        res.status(200).json({ message: 'Login successful', user: results[0] });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  });

// Server Setup
app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });