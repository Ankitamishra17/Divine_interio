import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXT = new Set([
  ".jpeg",
  ".jpg",
  ".jfif",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

// Extension to use when a file arrives with no extension
const EXT_FROM_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext =
      path.extname(file.originalname).toLowerCase() ||
      EXT_FROM_MIME[file.mimetype] ||
      "";
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = Boolean(EXT_FROM_MIME[file.mimetype]);
  const extOk = ALLOWED_EXT.has(ext);

  // Browser must say it's an image, and the extension must be known (or missing)
  if (mimeOk && (extOk || ext === "")) {
    return cb(null, true);
  }
  cb(new Error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB
  },
});

/*
  Use this in routes instead of upload.single(...).
  It sends upload errors back as JSON, so the admin page shows a clear
  message instead of failing with "Unexpected token '<'".

  Example:  router.post("/", uploadSingle("image"), createProject);
*/
export const uploadSingle = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large. Maximum size is 8 MB"
          : err.message;
      return res.status(400).json({ success: false, message });
    }
    next();
  });
};

export default upload;