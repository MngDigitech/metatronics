
const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

const products = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
);

console.log("\n========== PRODUCT NAME INSPECTION ==========\n");

products.forEach((product, index) => {
    console.log(
        `${index + 1}. ${product.name}`
    );
});

console.log("\nTotal names inspected:", products.length);

console.log("\n========== INSPECTION COMPLETE ==========\n");
