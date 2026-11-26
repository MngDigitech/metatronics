
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

const outputPath = path.join(
    __dirname,
    "../../data/product-name-cleaning-preview.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

function cleanProductName(name) {
    let cleaned = name.trim();

    // Standardise Apple product variations
    cleaned = cleaned.replace(/\bplus\b/gi, "Plus");
    cleaned = cleaned.replace(/\bpro\b/gi, "Pro");
    cleaned = cleaned.replace(/\bmax\b/gi, "Max");

    // Standardise Samsung product variations
    cleaned = cleaned.replace(/\bS25plus\b/gi, "S25 Plus");
    cleaned = cleaned.replace(/\bS23FE\b/gi, "S23 FE");
    cleaned = cleaned.replace(/\bplus\b/gi, "Plus");
    cleaned = cleaned.replace(/\bultra\b/gi, "Ultra");

    // Correct likely storage formatting
    cleaned = cleaned.replace(/\b1TGB\b/gi, "1TB");

    return cleaned;
}

const preview = products.map(product => {
    const suggestedName = cleanProductName(product.name);

    const issues = [];

    if (/Note20u/i.test(product.name)) {
        issues.push("Verify whether Note20u means Note20 Ultra");
    }

    const normalizedStorageName = product.name.replace(
    /\b1TGB\b/gi,
    "1TB"
);

if (!/\b\d+\s?(GB|TB)\b/i.test(normalizedStorageName)) {
    issues.push("Storage capacity missing or unclear");
}

    if (/1TGB/i.test(product.name)) {
        issues.push("Verify original storage specification");
    }

    return {
        id: product.id,
        originalName: product.name,
        suggestedName,
        changed: product.name !== suggestedName,
        issues,
        reviewRequired: issues.length > 0
    };
});

fs.writeFileSync(
    outputPath,
    JSON.stringify(preview, null, 2)
);

const changed = preview.filter(item => item.changed);
const flagged = preview.filter(item => item.reviewRequired);

console.log("\n========== NAME CLEANING PREVIEW ==========\n");

console.log("Total products:", preview.length);
console.log("Names with suggested changes:", changed.length);
console.log("Products requiring review:", flagged.length);

console.log("\nSuggested changes:");

changed.forEach(item => {
    console.log(`${item.originalName} -> ${item.suggestedName}`);
});

console.log("\nProducts requiring review:");

flagged.forEach(item => {
    console.log(item.originalName);
    console.log("Issues:", item.issues);
});

console.log("\nPreview saved to:", outputPath);

console.log("\n========== PREVIEW COMPLETE ==========\n");
