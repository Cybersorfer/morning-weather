import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8794;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];

  let filePath;
  if (urlPath.startsWith("/data/")) {
    filePath = path.join(ROOT, urlPath.slice(1));
  } else if (urlPath === "/ALEXA-SETUP.html") {
    filePath = path.join(ROOT, "ALEXA-SETUP.html");
  } else {
    filePath = path.join(PUBLIC, urlPath);
  }

  const allowedRoot = urlPath.startsWith("/data/") || urlPath === "/ALEXA-SETUP.html" ? ROOT : PUBLIC;
  if (!filePath.startsWith(allowedRoot)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Morning Weather → http://127.0.0.1:${PORT}/`);
  console.log("For Alexa, deploy public/ to HTTPS (GitHub Pages, Vercel, etc.)");
});
