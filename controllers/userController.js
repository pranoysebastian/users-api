import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken';
import { connectToDB } from "../db.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  const { email, password, name, phone, dob } = req.body;
  try {
    const db = await connectToDB();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, phone, dob, email, password: hashedPassword, oauth: false, createdAt: new Date() };

    const result = await users.insertOne(newUser);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectToDB();
    const users = db.collection("users");

    const user = await users.findOne({ email, oauth: false });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const authGoogle = async(req, res) =>{
    const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    const db = await connectToDB();
    const users = db.collection("users");

    let user = await users.findOne({ email, oauth: true });
    if (!user) {
        await users.insertOne({ name, email, oauth: true, provider: 'google', createdAt: new Date() });
    }

    res.status(200).json({ email, name, picture });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}