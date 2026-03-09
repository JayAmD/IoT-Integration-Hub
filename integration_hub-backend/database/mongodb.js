import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Database URI is not defined. Please set the DB_URI environment variable inside .env.*.local",
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connected to the database successfully! In ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);

    process.exit(1);
  }
};

export default connectToDatabase;