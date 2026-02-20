import express from "express";
import {
  deleteBlog,
  editBlog,
  getBlogs,
  getSpecificBlog,
  updatePassword,
  uploadBlog,
  createEvent,
  getEvents,
  getSpecificEvent,
  editEvent,
  deleteEvent,
  addGalleryImage,
  getGallery,
  getSpecificGalleryImage,
  deleteGalleryImage,
  addMember,
  getMembers,
  getSpecificMember,
  editMember,
  deleteMember,
  createNotice,
  getNotices,
  getSpecificNotice,
  editNotice,
  deleteNotice,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Public routes ─────────────────────────────────────────────────────────

// Public read endpoints (no auth required for public-facing data)
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getSpecificBlog);
router.get("/events", getEvents);
router.get("/events/:id", getSpecificEvent);
router.get("/gallery", getGallery);
router.get("/gallery/:id", getSpecificGalleryImage);
router.get("/members", getMembers);
router.get("/members/:id", getSpecificMember);
router.get("/notices", getNotices);
router.get("/notices/:id", getSpecificNotice);

// ─── Protected routes (require JWT) ────────────────────────────────────────

router.use(authMiddleware);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Blog management
router.post("/blogs", uploadBlog);
router.put("/blogs/:id", editBlog);
router.delete("/blogs/:id", deleteBlog);

// Event management
router.post("/events", createEvent);
router.put("/events/:id", editEvent);
router.delete("/events/:id", deleteEvent);

// Gallery management
router.post("/gallery", addGalleryImage);
router.delete("/gallery/:id", deleteGalleryImage);

// Member management
router.post("/members", addMember);
router.put("/members/:id", editMember);
router.delete("/members/:id", deleteMember);

// Notice management
router.post("/notices", createNotice);
router.put("/notices/:id", editNotice);
router.delete("/notices/:id", deleteNotice);

// Admin settings
router.put("/update-password", updatePassword);

export default router;