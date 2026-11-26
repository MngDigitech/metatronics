
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/cleaned-products.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

console.log("\n========== CLEANED DATA VALIDATION ==========\n");

const ids = products.map(product => product.id);

const duplicateIds = ids.filter(
    (id, index) => ids.indexOf(id) !== index
);

const missingIds = products.filter(
    product => !product.id
);

const invalidPrices = products.filter(
    product =>
        typeof product.price !== "number" ||
        !Number.isFinite(product.price)
);

const missingNames = products.filter(
    product => !product.name || !product.name.trim()
);

const missingCategories = products.filter(
    product => !product.category
);

const missingImages = products.filter(
    product => !product.image ||
    !product.image.desktop
);

console.log("Total products:", products.length);
console.log("Missing IDs:", missingIds.length);
console.log("Duplicate IDs:", [...new Set(duplicateIds)]);
console.log("Invalid prices:", invalidPrices.length);
console.log("Missing names:", missingNames.length);
console.log("Missing categories:", missingCategories.length);
console.log("Missing images:", missingImages.length);

console.log("\n========== VALIDATION COMPLETE ==========\n");
