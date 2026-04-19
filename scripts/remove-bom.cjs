const fs = require("fs");
const path = require("path");

function removeBOM(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== "dist") {
        removeBOM(filePath);
      }
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".jsx") ||
      file.endsWith(".css") ||
      file.endsWith(".html") ||
      file.endsWith(".json")
    ) {
      let content = fs.readFileSync(filePath, "utf8");
      if (content.charCodeAt(0) === 0xfeff) {
        console.log(`Removing BOM from: ${filePath}`);
        content = content.slice(1);
        fs.writeFileSync(filePath, content, "utf8");
      }
    }
  });
}

removeBOM(process.cwd());
console.log("BOM removal complete.");
