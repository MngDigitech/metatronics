
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

    // Correct confirmed storage notation
    cleaned = cleaned.replace(/\b1TGB\b/gi, "1TB");

    // Provisional model-name standardisation
    cleaned = cleaned.replace(/\bNote20u\b/gi, "Note20 Ultra");

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

console.log("Original products:", products.length);
console.log("Cleaned products:", cleanedProducts.length);

console.log("\nReviewed products:");

cleanedProducts
    .filter(product =>
        /iPhone 14 Pro Max 1TB|iPhone 15$|iPhone 15 Pro 1TB|iPhone 15 Pro Max 1TB|Note20 Ultra/i.test(product.name)
    )
    .forEach(product => console.log(product.name));

console.log("\nOutput:", outputPath);
