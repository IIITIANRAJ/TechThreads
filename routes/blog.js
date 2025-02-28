const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");  // Ensure User model is included

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

// Configure multer upload with file size and type restrictions
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
});

// Route to render form to add a new blog
router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

// Route to view a blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("blog", { user: req.user, blog, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Route to add a comment
router.post('/comment/:blogId', async (req, res) => {
  try {
    if (!req.body.content || req.body.content.trim() === '') {
      return res.status(400).send('Comment content cannot be empty');
    }

    const comment = await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to create a new blog post
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!req.file) {
      return res.status(400).send("Cover image is required");
    }

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });

    res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
