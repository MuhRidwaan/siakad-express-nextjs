// Server entry point (starts the server)
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend berjalan di http://localhost:${PORT}`);
});