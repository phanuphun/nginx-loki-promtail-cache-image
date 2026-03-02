const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const imagesDir = path.join(__dirname, "images");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "image-server" });
});

app.get("/images", async (req, res) => {
  try {
    const files = await fs.promises.readdir(imagesDir);

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"].includes(ext);
    });

    const images = imageFiles.map((name) => ({
      name,
      url: `${req.protocol}://${req.get("host")}/images/${encodeURIComponent(name)}`,
    }));

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Cannot read images directory" });
  }
});

app.get("/images/:name", (req, res) => {
  const { name } = req.params;
  const imagePath = path.join(imagesDir, name);

  if (!imagePath.startsWith(imagesDir)) {
    return res.status(400).json({ message: "Invalid image name" });
  }

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.sendFile(imagePath);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
