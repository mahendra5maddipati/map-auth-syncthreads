require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Replace with your actual MongoDB URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Dashboard Card Schema
const CardSchema = new mongoose.Schema({
  title: String,
  user: String, // Associate cards with a user
});
const Card = mongoose.model('Card', CardSchema);

// Map Marker Schema
const MarkerSchema = new mongoose.Schema({
  position: { type: [Number], required: true }, // [latitude, longitude]
  title: { type: String, required: true },
  user: String, // Associate markers with a user
});
const Marker = mongoose.model('Marker', MarkerSchema);

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// **User Registration API**
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ message: 'Username already exists' });
  }
});

// **Login API**
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// **Dashboard API (Protected)**
app.get('/api/dashboard', verifyToken, async (req, res) => {
  const username = req.user.username;

  try {
    const cards = await Card.find({ user: username });
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

// Add a new card (Protected)
app.post('/api/dashboard/cards', verifyToken, async (req, res) => {
  const { title } = req.body;
  const username = req.user.username;

  try {
    const newCard = new Card({ title, user: username });
    await newCard.save();
    res.json({ card: newCard });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add card' });
  }
});

// Delete a card (Protected)
app.delete('/api/dashboard/cards/:id', verifyToken, async (req, res) => {
  const cardId = req.params.id;
  const username = req.user.username;

  try {
    const card = await Card.findOneAndDelete({ _id: cardId, user: username });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete card' });
  }
});

// **Map View API (Protected)**
app.get('/api/map', verifyToken, async (req, res) => {
  const username = req.user.username;

  try {
    const markers = await Marker.find({ user: username });
    res.json({ center: [20.5937, 78.9629], zoom: 5, markers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch map data' });
  }
});

// Add a new marker (Protected)
app.post('/api/map/markers', verifyToken, async (req, res) => {
  const { position, title } = req.body;
  const username = req.user.username;

  try {
    const newMarker = new Marker({ position, title, user: username });
    await newMarker.save();
    res.json({ marker: newMarker });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save marker' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
