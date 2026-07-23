// File upload middleware using multer
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads/mahasiswa");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");
        const formattedDate = `${date}-${month}-${year}`; // Format: DD-MM-YYYY

        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const random = Math.floor(1000 + Math.random() * 9000);

        const newFilename = `${nameWithoutExt}_${formattedDate}_${random}${ext}`;
        cb(null, newFilename);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
        if (isValid) cb(null, true);
        else cb(new Error("Format file harus jpg, jpeg, atau png"));
    },
});