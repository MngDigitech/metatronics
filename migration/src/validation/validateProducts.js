
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

console.log("\n========== TRANSFORMATION VALIDATION ==========\n");

console.log("Total products:", products.length);

// Check missing IDs
const missingIds = products.filter(product => !product.id);

// Check duplicate IDs
const ids = products.map(product => product.id);
const duplicateIds = ids.filter(
    (id, index) => ids.indexOf(id) !== index
);

// Check invalid prices
const invalidPrices = products.filter(
    product => typeof product.price !== "number"
);

// Check missing names
const missingNames = products.filter(
    product => !product.name
);

// Check missing categories
const missingCategories = products.filter(
    product => !product.category
);

console.log("Missing IDs:", missingIds.length);
console.log("Duplicate IDs:", [...new Set(duplicateIds)]);
console.log("Invalid prices:", invalidPrices.length);
console.log("Missing names:", missingNames.length);
console.log("Missing categories:", missingCategories.length);

console.log("\n========== VALIDATION COMPLETE ==========\n");
