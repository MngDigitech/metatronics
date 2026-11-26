
const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../../data.json");
const rawData = fs.readFileSync(filePath, "utf8");
const products = JSON.parse(rawData);

console.log("\n========== DATA QUALITY PROFILING ==========\n");

// 1. Total records
console.log("Total products:", products.length);

// 2. Check duplicate product names
const nameCounts = {};

products.forEach((product) => {
    nameCounts[product.name] =
        (nameCounts[product.name] || 0) + 1;
});

const duplicateNames = Object.entries(nameCounts)
    .filter(([name, count]) => count > 1);

console.log("\nDuplicate product names:");
console.table(duplicateNames);

// 3. Inspect prices
const invalidPrices = [];

products.forEach((product, index) => {
    const numericPrice = Number(
        String(product.price).replace(/[^0-9.]/g, "")
    );

    if (!Number.isFinite(numericPrice)) {
        invalidPrices.push({
            record: index + 1,
            name: product.name,
            price: product.price
        });
    }
});

console.log("\nInvalid prices:", invalidPrices.length);
console.table(invalidPrices);

// 4. Inspect image paths
const missingImages = [];
const imagePaths = new Set();

products.forEach((product, index) => {
    const imagePath = product.image?.desktop;

    if (!imagePath) {
        missingImages.push({
            record: index + 1,
            name: product.name
        });
        return;
    }

    imagePaths.add(imagePath);

    const absoluteImagePath = path.resolve(
        __dirname,
        "../../",
        imagePath
    );

    if (!fs.existsSync(absoluteImagePath)) {
        missingImages.push({
            record: index + 1,
            name: product.name,
            image: imagePath
        });
    }
});

console.log("\nUnique image paths:", imagePaths.size);
console.log("Missing or invalid image files:", missingImages.length);
console.table(missingImages);

// 5. Check suspicious product names
const suspiciousNames = products
    .map((product, index) => ({
        record: index + 1,
        name: product.name
    }))
    .filter((product) =>
        /1TGB|undefined|null/i.test(product.name)
    );

console.log("\nSuspicious product names:", suspiciousNames.length);
console.table(suspiciousNames);

console.log("\n========== PROFILING COMPLETE ==========\n");

