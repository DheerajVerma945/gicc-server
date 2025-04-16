import express from "express";
import { deleteBlog, editBlog, getBlogs, getSpecificBlog, updatePassword, uploadBlog } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/blogs", uploadBlog);
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getSpecificBlog);
router.put("/blogs/:id", editBlog);
router.delete("/blogs/:id", deleteBlog);

router.put("/update-password", updatePassword);
export default router;