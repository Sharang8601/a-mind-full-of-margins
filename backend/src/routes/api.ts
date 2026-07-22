import { Router } from "express";
import multer from "multer";
import { getArticles, createArticle, updateArticle, deleteArticle } from "../controllers/articleController";
import { uploadImage } from "../controllers/uploadController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Articles routes
router.get("/articles", getArticles);
router.post("/articles", requireAuth, createArticle);
router.put("/articles/:id", requireAuth, updateArticle);
router.delete("/articles/:id", requireAuth, deleteArticle);

// Upload routes
router.post("/upload", requireAuth, upload.single("file"), uploadImage);

export default router;
