import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(process.cwd(), "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
