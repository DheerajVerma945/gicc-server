
import Blog from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadBlog = async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const imageUpload = await cloudinary.uploader.upload(image, {
    folder: "blog",
  });

  if (!imageUpload) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  const imageUrl = imageUpload.secure_url;

  try {
    const blog = await Blog.create({
      title,
      description,
      image: imageUrl,
    });
    return res
      .status(200)
      .json({ message: "Blog uploaded successfully", blog });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

export const getSpecificBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blog" });
  }
};

export const editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;

  try {
    const updatedData = { title, description };

    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image, {
        folder: "blog",
      });
      if (imageUpload) {
        updatedData.image = imageUpload.secure_url;
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update blog" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};


export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update password" });
  }
};

