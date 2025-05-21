import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI; // use dotenv for security
console.log("Mongo URI:", process.env.MONGO_URI);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
});

export const connectToDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("myApp");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

