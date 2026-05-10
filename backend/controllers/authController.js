const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = (req, res) => {
  // log incoming headers, raw body and parsed body for easier debugging
  console.log("[authController] register headers:", req.headers);
  console.log("[authController] register rawBody:", req.rawBody);
  console.log("[authController] register body:", req.body);

  const { name, email, password } = req.body || {};

  // 1. Validate input (trim strings)
  const nameTrim = typeof name === "string" ? name.trim() : "";
  const emailTrim = typeof email === "string" ? email.trim() : "";

  if (!nameTrim || !emailTrim || !password) {
    const missing = [];
    if (!nameTrim) missing.push("name");
    if (!emailTrim) missing.push("email");
    if (!password) missing.push("password");

    console.warn(
      `[authController] validation failed - missing: ${missing.join(", ")}`
    );

    return res.status(400).json({
      message: "All fields are required",
      missing,
      received: Object.keys(req.body || {}),
    });
  }

  // 2. Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3. Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 4. Insert user
    const insertUserQuery =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(
      insertUserQuery,
      [nameTrim, emailTrim, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("[authController] insert error:", err);
          return res.status(500).json({ message: "User registration failed" });
        }

        res.status(201).json({
          message: "User registered successfully",
        });
      }
    );
  });
};
// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Find user
  const findUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(findUserQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    // 3. Compare password
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};
