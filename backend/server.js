// 1. Load environment variables early
require('dotenv').config();

// 2. Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const User = require('./models/User');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 3. App Setup
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. MongoDB Connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weatherapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));

// 6. Redis Setup
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
redisClient.connect().then(() => {
  console.log('✅ Connected to Redis');
});

// 7. Authentication Routes

// --- SIGNUP ---
app.post('/signup', async (req, res) => {
  const { name, email, password, location, unit } = req.body;

  if (!name || !email || !password || !location || !unit) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, location, unit });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// --- LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 8. Weather Route
app.get('/weather', async (req, res) => {
  const city = req.query.city?.toLowerCase();

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const cachedData = await redisClient.get(city);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      parsed.cached = true;
      console.log('Serving from Redis cache 🔁');
      return res.json(parsed);
    }

    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return res.status(apiRes.status).json({ error: errorData.message || 'Error fetching weather' });
    }

    const data = await apiRes.json();
    data.cached = false;
    await redisClient.setEx(city, 600, JSON.stringify(data));

    console.log('Serving from API ☁️');
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 9. Start Server
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
