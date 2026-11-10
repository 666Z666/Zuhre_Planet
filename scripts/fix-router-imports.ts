#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const routerPath = "D:\\Projeler\\Zuhre_Planet\\src\\server\\routers";
const routerFiles = [
  "admin_actions.router.ts",
  "appointment.router.ts",
  "chat.router.ts",
  "escort.router.ts",
  "forum.router.ts",
  "media.router.ts",
  "verification.router.ts",
];

for (const file of routerFiles) {
  const filePath = path.join(routerPath, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Replace imports
    content = content.replace(
      "from '../router'",
      "from '../router.core'"
    );
    content = content.replace(
      'from "../router"',
      'from "../router.core"'
    );

    fs.writeFileSync(filePath, content, "utf-8");
    console.warn(`Fixed: ${file}`);
  } else {
    console.warn(`Not found: ${file}`);
  }
}

console.warn("All router imports processed.");
