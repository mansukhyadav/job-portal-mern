import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";

/**
 * requireAuth: verifies the request carries a valid Clerk session and
 * attaches the corresponding local User document to req.user.
 * If the user doesn't exist locally yet (first request after signup),
 * it is lazily created from Clerk's user record.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: please sign in" });
    }

    let user = await User.findById(userId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.create({
        _id: userId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        role: clerkUser.publicMetadata?.role || "seeker",
      });
    }

    req.user = user;
    req.auth = { userId };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

/**
 * requireRole: gate a route to a specific role (e.g. only recruiters
 * can post jobs, only seekers can apply).
 */
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: `Forbidden: this action requires the '${role}' role`,
    });
  }
  next();
};
