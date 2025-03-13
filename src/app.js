import express from "express";
import expressWs from "express-ws";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { router as registerRouter } from "./auth/api.js";
import { router as indexRouter } from "./api/index.js";
import process from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

expressWs(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use(registerRouter);
app.use(indexRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

  app.listen(PORT, HOST, () => {
    console.log(
      `Server running on ${
        process.env.NODE_ENV === "production"
          ? `https://Vef2-hop1.onrender.com`
          : `https://localhost:${PORT}`
      }`,
    );
  });
}
