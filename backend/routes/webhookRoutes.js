import express from "express";
import { Webhook } from "svix";
import User from "../models/User.js";

const router = express.Router();

// Clerk sends signup/update/delete events here so our DB stays in sync
// even if a user is created/edited directly from the Clerk dashboard.
// NOTE: this route needs the raw request body, so it's mounted with
// express.raw() in server.js BEFORE the global express.json() parser.
router.post("/clerk", async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = evt;

    if (type === "user.created" || type === "user.updated") {
      await User.findByIdAndUpdate(
        data.id,
        {
          _id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "New User",
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
        },
        { upsert: true, new: true }
      );
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    res.status(400).json({ success: false, message: "Webhook verification failed" });
  }
});

export default router;
