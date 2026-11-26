
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

const outputPath = path.join(
    __dirname,
    "../../data/cleaned-products.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

function cleanProductName(name) {
    let cleaned = name.trim();

    // Standardise Apple naming
    cleaned = cleaned.replace(/\bplus\b/gi, "Plus");
    cleaned = cleaned.replace(/\bpro\b/gi, "Pro");
    cleaned = cleaned.replace(/\bmax\b/gi, "Max");

    // Standardise Samsung naming
    cleaned = cleaned.replace(/\bS25plus\b/gi, "S25 Plus");
    cleaned = cleaned.replace(/\bS23FE\b/gi, "S23 FE");
    cleaned = cleaned.replace(/\bultra\b/gi, "Ultra");
    
    // Correct storage notation
    cleaned = cleaned.replace(/\b1TGB\b/gi, "1TB");

    return cleaned;
}

const cleanedProducts = products.map(product => ({
    ...product,
    name: cleanProductName(product.name)
}));

fs.writeFileSync(
    outputPath,
    JSON.stringify(cleanedProducts, null, 2)
);

console.log("\n========== PRODUCT CLEANING ==========\n");

console.log("Original products:", products.length);
console.log("Cleaned products:", cleanedProducts.length);

const changed = cleanedProducts.filter((product, index) =>
    product.name !== products[index].name
);

console.log("Names standardised:", changed.length);

console.log("\nSample changes:");

changed.slice(0, 10).forEach(product => {
    const original = products.find(p => p.id === product.id);

    console.log(`${original.name} -> ${product.name}`);
});

console.log("\nOutput:", outputPath);

console.log("\n========== CLEANING COMPLETE ==========\n");
