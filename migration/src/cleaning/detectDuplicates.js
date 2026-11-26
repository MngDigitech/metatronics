
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

console.log("\n========== DUPLICATE PRODUCT DETECTION ==========\n");

console.log("Total products:", products.length);

// Group products by their names
const productGroups = {};

products.forEach(product => {
    const key = product.name.trim().toLowerCase();

    if (!productGroups[key]) {
        productGroups[key] = [];
    }

    productGroups[key].push(product);
});

// Identify names appearing more than once
const duplicates = Object.entries(productGroups)
    .filter(([name, records]) => records.length > 1);

console.log("Duplicate product names:", duplicates.length);

duplicates.forEach(([name, records]) => {
    console.log("\nProduct:", name);
    console.log("Occurrences:", records.length);

    records.forEach(product => {
        console.log({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price
        });
    });
});

console.log("\n========== DETECTION COMPLETE ==========\n");
