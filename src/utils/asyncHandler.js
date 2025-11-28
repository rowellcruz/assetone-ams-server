import { logActivity } from "./activityLogger.js";
import * as userModel from "../models/userModel.js";

const asyncHandler =
  (fn, moduleName, defaultAction = null) =>
  async (req, res, next) => {
    let userId = req.user?.id || null;
    const actionMap = {
      POST: "CREATE",
      PATCH: "UPDATE",
      DELETE: "DELETE",
      GET: "VIEW",
    };
    const action = defaultAction || actionMap[req.method] || "UNKNOWN";

    // For LOGIN, try to get userId from email
    if (!userId && defaultAction === "LOGIN") {
      const { email } = req.body;
      if (email) {
        const user = await userModel.getUserDataByEmail(email);
        if (user) userId = user.id;
      }
    }

    // Helper function to log activity
    const log = async (statusSuffix = "") => {
      if (!moduleName) return;
      await logActivity({
        userId,
        module: moduleName,
        action: action + statusSuffix,
        endpoint: req.originalUrl,
        method: req.method,
        body: req.body && Object.keys(req.body).length ? req.body : null,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
        statusCode: res.statusCode || 200,
      });
    };

    try {
      await fn(req, res, next);
      await log();
    } catch (err) {
      res.statusCode = err.statusCode || 500;
      await log("_FAILED");
      next(err);
    }
  };

export default asyncHandler;
