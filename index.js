import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { connectToDB } from "./db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.get('/healthcheck', (req, res) => {
    res.send('Ok');
});

const PORT = process.env.PORT || 5000;

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// const GOOGLE_CLIENT_ID = "437871622895-9uiqbbeplgum13ah66pg20tnr01lg2t4.apps.googleusercontent.com";
// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// app.get('/healthcheck', (req, res) => {
//     res.send('Ok');
// });

/* app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
//   const user = users.find((u) => u.email === email);
//   if (!user) return res.status(401).json({ error: "Invalid email or password" });

//   const isMatch = await bcrypt.compare(password, user.passwordHash);
//   if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

//   const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful" });
});

app.post("/api/auth/google", async (req, res) => {
  console.log('Request Received!');
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // TODO: Check if user exists in DB, create if not, create session/JWT
    console.log("Verified user:", { email, name, picture });

    res.status(200).json({ email, name, picture });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}); */

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));