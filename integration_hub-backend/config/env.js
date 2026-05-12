import { config } from "dotenv"; //injects values into environment

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, API_KEYS_MASTER_KEY, UDP_SERVER_TO_MAIN_APP_API_KEY, CORS_ORIGIN} = process.env;