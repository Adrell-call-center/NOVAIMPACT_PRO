#!/usr/bin/env node
/**
 * Downloads all Unsplash images used in the project and saves them locally.
 * Run with: node scripts/download-unsplash.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../public/images/unsplash");

// Map of photo-id => download URL (highest quality needed across all usages)
const images = {
  // About
  "photo-1522202176988-66273c2fd55f": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=1067&q=80",
  "photo-1556155092-490a1ba16284":   "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=440&h=587&q=80",
  "photo-1504384308090-c894fdcc538d":"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1515187029135-18ee286d815b":"https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&h=800&q=80",
  // FAQ
  "photo-1551434678-e076c223a692":   "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&h=800&q=80",
  // Hero
  "photo-1522071820081-009f0129c71c":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=800&q=80",
  // Service Hero
  "photo-1542744173-8e7e53415bb0":   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=920&h=1227&q=80",
  // Home Results
  "photo-1460925895917-afdab827c52f":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=534&q=80",
  "photo-1504868584819-f8e8b4b6d7e3":"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&h=534&q=80",
  "photo-1563986768609-322da13575f3":"https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=534&q=80",
  // Services
  "photo-1499750310107-5fef28a66643":"https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=560&h=747&q=80",
  "photo-1611162617213-7d7a39e9b1d7":"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=560&h=747&q=80",
  "photo-1498050108023-c5249f4df085":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1461749280684-dccba630e2f6":"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1432888498266-38ffec3eaf0a":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1516321318423-f06f85e504b3":"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1551288049-bebda4e38f71":   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1519389950473-47ba0277781c":"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1467232004584-a241de8bcf5d":"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1260&h=710&q=80",
  // Team / Testimonials
  "photo-1560250097-0b93528c311a":   "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1573496359142-b8d87734a5a2":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1507003211169-0a1dd7228f2d":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1494790108377-be9c29b29330":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=800&q=80",
  // Story
  "photo-1600880292203-757bb62b4baf":"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&h=900&q=80",
  "photo-1553877522-43269d4ea984":   "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1040&h=693&q=80",
  "photo-1557804506-669a67965ba0":   "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=820&h=547&q=80",
  // Service details - website-creation
  "photo-1547658719-da2b51169166":   "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1531482615713-2afd69097998":"https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - comparator
  "photo-1454165804606-c3d57bc86b40":"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1543286386-713bdd548da4":   "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - brand-identity
  "photo-1634084462412-b54873c0a56d":"https://images.unsplash.com/photo-1634084462412-b54873c0a56d?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1626785774573-4b799315345d":"https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1524758631624-e2822e304c36":"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1260&h=710&q=80",
  "photo-1509343256512-d77a5cb3791b":"https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - google-ads
  "photo-1573804633927-bfcbcd909acd":"https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1542744094-3a31f272c490":   "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - consulting
  "photo-1521791136064-7986c2920216":"https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1559136555-9303baea8ebd":   "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - content-creation
  "photo-1552664730-d307ca884978":   "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1455390582262-044cdead277a":"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - social-media
  "photo-1600096194534-95cf5ece2e2e":"https://images.unsplash.com/photo-1600096194534-95cf5ece2e2e?auto=format&fit=crop&w=600&h=800&q=80",
  "photo-1562577309-4932fdd64cd1":   "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1260&h=710&q=80",
  // Service details - meta-ads
  "photo-1611926653458-09294b3142bf":"https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=800&h=600&q=80",
  "photo-1579869847557-1f67382cc158":"https://images.unsplash.com/photo-1579869847557-1f67382cc158?auto=format&fit=crop&w=600&h=800&q=80",
  // Service details - seo
  "photo-1572177812156-58036aae439c":"https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=800&h=600&q=80",
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  SKIP (exists): ${path.basename(dest)}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const entries = Object.entries(images);
  for (const [id, url] of entries) {
    const dest = path.join(OUTPUT_DIR, `${id}.jpg`);
    process.stdout.write(`Downloading ${id}... `);
    try {
      await download(url, dest);
      console.log("OK");
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }
  console.log("\nDone! All images saved to public/images/unsplash/");
}

main();
