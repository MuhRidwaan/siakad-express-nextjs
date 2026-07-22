// Express Application setup and middleware configuration
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import prodiRoutes from "./routes/prodi.routes";
import mahasiswaRoutes from "./routes/mahasiswa.routes";
import userRoutes from "./routes/user.routes";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file untuk foto mahasiswa
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
    res.json({ message: "Akademik API berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;