import fs from "fs";

const versionData = {
  version: Date.now().toString(),
};

fs.writeFileSync("./public/version.json", JSON.stringify(versionData));

console.log("Version file generated:", versionData.version);
