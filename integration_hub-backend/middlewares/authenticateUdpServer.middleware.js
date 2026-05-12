import { UDP_SERVER_TO_MAIN_APP_API_KEY } from "../config/env.js";

const authenticateUdpServer = (req, res, next) => {
  try {
    if (!UDP_SERVER_TO_MAIN_APP_API_KEY) {
      const error = new Error("UDP_SERVER_TO_MAIN_APP_API_KEY key is not configured");
      error.statusCode = 500;
      throw error;
    }

    const providedKey = req.header("x-api-key");

    if (!providedKey || providedKey !== UDP_SERVER_TO_MAIN_APP_API_KEY) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUdpServer;