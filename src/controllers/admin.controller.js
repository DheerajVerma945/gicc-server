import Admin from "../models/admin.model.js";
import Blog from "../models/blog.model.js";
import Event from "../models/event.model.js";
import Gallery from "../models/gallery.model.js";
import Member from "../models/member.model.js";
import Notice from "../models/notice.model.js";
import cloudinary from "../utils/cloudinary.js";

// ─── Blog Controllers ───────────────────────────────────────────────────────

export const uploadBlog = async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const imageUpload = await cloudinary.uploader.upload(image, {
      folder: "blog",
    });

    if (!imageUpload) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const blog = await Blog.create({
      title,
      description,
      imageUrl: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id,
    });
    return res.status(200).json({ message: "Blog uploaded successfully", blog });
  } catch (error) {
    console.log("Error in uploading blog:", error);
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
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const updatedData = { title, description };

    if (image) {
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId).catch(() => {});
      }
      const imageUpload = await cloudinary.uploader.upload(image, {
        folder: "blog",
      });
      updatedData.imageUrl = imageUpload.secure_url;
      updatedData.imagePublicId = imageUpload.public_id;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });
    return res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.log("Error in editing blog:", error);
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
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId).catch(() => {});
    }
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await Admin.findOne({});
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update password" });
  }
};

// ─── Event Controllers ──────────────────────────────────────────────────────

export const createEvent = async (req, res) => {
  const { title, description, date, venue, image, isActive } = req.body;
  if (!title || !description || !date) {
    return res.status(400).json({ message: "title, description and date are required" });
  }

  try {
    let imageUrl = "";
    let imagePublicId = "";
    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image, { folder: "events" });
      imageUrl = imageUpload.secure_url;
      imagePublicId = imageUpload.public_id;
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue: venue || "",
      imageUrl,
      imagePublicId,
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.log("Error in creating event:", error);
    return res.status(500).json({ message: "Failed to create event" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const getSpecificEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, venue, image, isActive } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedData = { title, description, date, venue, isActive };

    if (image) {
      if (event.imagePublicId) {
        await cloudinary.uploader.destroy(event.imagePublicId).catch(() => {});
      }
      const imageUpload = await cloudinary.uploader.upload(image, { folder: "events" });
      updatedData.imageUrl = imageUpload.secure_url;
      updatedData.imagePublicId = imageUpload.public_id;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
    return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.log("Error in editing event:", error);
    return res.status(500).json({ message: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId).catch(() => {});
    }
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event" });
  }
};

// ─── Gallery Controllers ─────────────────────────────────────────────────────

export const addGalleryImage = async (req, res) => {
  const { image, title, category } = req.body;
  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const imageUpload = await cloudinary.uploader.upload(image, { folder: "gallery" });

    const galleryItem = await Gallery.create({
      imageUrl: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id,
      title: title || "",
      category: category || "general",
    });
    return res.status(201).json({ message: "Image added to gallery successfully", galleryItem });
  } catch (error) {
    console.log("Error in adding gallery image:", error);
    return res.status(500).json({ message: "Failed to add image to gallery" });
  }
};

export const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const gallery = await Gallery.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(gallery);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gallery" });
  }
};

export const getSpecificGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery image not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gallery image" });
  }
};

export const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery image not found" });
    }
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId).catch(() => {});
    }
    return res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete gallery image" });
  }
};

// ─── Member Controllers ──────────────────────────────────────────────────────

export const addMember = async (req, res) => {
  const { name, role, department, email, phone, image, order, isActive } = req.body;
  if (!name || !role) {
    return res.status(400).json({ message: "name and role are required" });
  }

  try {
    let imageUrl = "";
    let imagePublicId = "";
    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image, { folder: "members" });
      imageUrl = imageUpload.secure_url;
      imagePublicId = imageUpload.public_id;
    }

    const member = await Member.create({
      name,
      role,
      department: department || "",
      email: email || "",
      phone: phone || "",
      imageUrl,
      imagePublicId,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.status(201).json({ message: "Member added successfully", member });
  } catch (error) {
    console.log("Error in adding member:", error);
    return res.status(500).json({ message: "Failed to add member" });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch members" });
  }
};

export const getSpecificMember = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    return res.status(200).json(member);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch member" });
  }
};

export const editMember = async (req, res) => {
  const { id } = req.params;
  const { name, role, department, email, phone, image, order, isActive } = req.body;

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const updatedData = { name, role, department, email, phone, order, isActive };

    if (image) {
      if (member.imagePublicId) {
        await cloudinary.uploader.destroy(member.imagePublicId).catch(() => {});
      }
      const imageUpload = await cloudinary.uploader.upload(image, { folder: "members" });
      updatedData.imageUrl = imageUpload.secure_url;
      updatedData.imagePublicId = imageUpload.public_id;
    }

    const updatedMember = await Member.findByIdAndUpdate(id, updatedData, { new: true });
    return res.status(200).json({ message: "Member updated successfully", member: updatedMember });
  } catch (error) {
    console.log("Error in editing member:", error);
    return res.status(500).json({ message: "Failed to update member" });
  }
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (member.imagePublicId) {
      await cloudinary.uploader.destroy(member.imagePublicId).catch(() => {});
    }
    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete member" });
  }
};

// ─── Notice Controllers ──────────────────────────────────────────────────────

export const createNotice = async (req, res) => {
  const { title, content, priority, isActive } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "title and content are required" });
  }

  try {
    const notice = await Notice.create({
      title,
      content,
      priority: priority || "medium",
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.status(201).json({ message: "Notice created successfully", notice });
  } catch (error) {
    console.log("Error in creating notice:", error);
    return res.status(500).json({ message: "Failed to create notice" });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    return res.status(200).json(notices);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notices" });
  }
};

export const getSpecificNotice = async (req, res) => {
  const { id } = req.params;
  try {
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    return res.status(200).json(notice);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notice" });
  }
};

export const editNotice = async (req, res) => {
  const { id } = req.params;
  const { title, content, priority, isActive } = req.body;

  try {
    const notice = await Notice.findByIdAndUpdate(
      id,
      { title, content, priority, isActive },
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    return res.status(200).json({ message: "Notice updated successfully", notice });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notice" });
  }
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  try {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    return res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete notice" });
  }
};

// ─── Dashboard Controllers ───────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
  try {
    const [blogs, events, gallery, members, notices] = await Promise.all([
      Blog.countDocuments(),
      Event.countDocuments(),
      Gallery.countDocuments(),
      Member.countDocuments(),
      Notice.countDocuments(),
    ]);
    return res.status(200).json({ blogs, events, gallery, members, notices });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


