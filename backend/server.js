const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require("axios");
const OpenAI = require('openai');
const User = require('./models/User');
const CodeSnippet = require('./models/CodeSnippetSchema');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error('MongoDB connection error:', err));

  const verifyToken = (req, res, next) => {
    console.log("Middlewate is triggred");
    var token = req.headers.authorization
    if (!token) {
      res.send("Request Denied");
    }
    try {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user
    } catch (error) {
      console.log(error);
      res.send("Error in Token")
    }
    next();
  };
  
  app.get('/json', verifyToken, (req, res) => {
    console.log("inside json route");
    res.json({ message: "This is a middleware check", user: req.user.userName })
  })
  


// Signup Route
app.post("/signup", async (req, res) => {
  var { userName, email, password } = req.body;
  var hashedPassword = await bcrypt.hash(password, 15);
  console.log(hashedPassword);
  try {
    const newUser = new User({
      name: userName,
      email: email,
      password: hashedPassword,
    });
    console.log(newUser);
    newUser.save();
    res.status(201).send({ response: "signup successfull", signupStatus: true });
  } catch (err) {
    res.status(400).send("Signup Unsuccessfull", err);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ response: "User not found", loginStatus: false });
    }
    const payload = {
      email: user.email,
      userName: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24hr",
    });
    console.log(token);
    if (bcrypt.compare(user.password, password)) {
      res.status(200).send({ response: "Login successful", loginStatus: true, token: token, email: email });
    } else {
      res.status(401).send({ response: "Incorrect password", loginStatus: false });
    }
  } catch (err) {
    res.status(500).send("Error during login");
  }
});

// GROQ (LLaMA) Integration for Code Explanation
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_TOKEN,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/explain", async (req, res) => {
  const { code } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
             "You are a helpful AI assistant. When given code, respond ONLY with a JSON object including:\n" +
              "1. explanation: beginner-friendly explanation.\n" +
              "2. suggestion: code improvement suggestion.\n" +
              "3. improved_code: plain revised code with no markdown or formatting characters.\n\n" +
              `Format: {"explanation": "...", "suggestion": "...", "improved_code": "..."}` +
              "\nDo not include any other text or markdown like ```.",
        },
        {
          role: "user",
          content: `Explain and suggest improvements for the following code:\n\n${code}`,
        },
      ],
      temperature: 0.5,
    });

    const aiText = completion.choices[0].message.content;
    const parsed = JSON.parse(aiText);
    res.json(parsed);
  } catch (error) {
    console.error("Groq Error:", error.message);
    res.status(500).json({ error: "Failed to get response from Groq." });
  }
});

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

app.post("/debug", async (req, res) => {
  const { code, language, input } = req.body;
  const languageId = languageMap[language];

  if (!languageId) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageId,
        stdin: input || "",  
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error from Judge0:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
});

app.post('/save', async (req, res) => {
  const { email, code, language, explanation, suggestion } = req.body;

  if (!email || !code || !language || !explanation || !suggestion) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newSnippet = new CodeSnippet({
      user: user._id,
      code,
      language,
      explanation,
      suggestion
    });

    await newSnippet.save();
    res.status(201).json({ message: 'Code snippet saved successfully' });
  } catch (error) {
    console.error('Error saving snippet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/history/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const snippets = await CodeSnippet.find({ user: user._id }).sort({ savedAt: -1 });
    res.json(snippets);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
