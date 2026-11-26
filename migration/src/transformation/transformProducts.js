
const fs = require("fs");
const path = require("path");

// Location of our original working copy
const inputPath = path.join(
    __dirname,
    "../../data/products.json"
);

// Location where transformed data will be saved
const outputPath = path.join(
    __dirname,
    "../../data/transformed-products.json"
);

console.log("Product Catalogue Transformation");
console.log("---------------------------------");
console.log("Input:", inputPath);
console.log("Output:", outputPath);


// Generate a consistent ID for each product
function generateProductId(product) {
    const category = product.category
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    const name = product.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    return `${category}-${name}`.replace(/-+/g, "-");
}


// Convert price from string to number
function convertPrice(price) {

    if (typeof price !== "string") {
        throw new Error(`Price must be a string. Received: ${price}`);
    }

    // Remove R, commas and spaces
    const cleanedPrice = price.replace(/[R,\s]/g, "");

    const numericPrice = Number(cleanedPrice);

    // Validate the converted price
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        throw new Error(`Invalid product price: ${price}`);
    }

    return Number(numericPrice.toFixed(2));
}

function transformProducts(products) {
    const usedIds = new Set();

    const transformedProducts = products.map((product, index) => {

        // Generate product ID
        const id = generateProductId(product);

        // Check for duplicate IDs
        if (usedIds.has(id)) {
            throw new Error(
                `Duplicate ID found at record ${index + 1}: ${id}`
            );
        }

        usedIds.add(id);

        // Return transformed product
        return {
            ...product,
            id: id,
            price: convertPrice(product.price)
        };
    });

    return transformedProducts;
}


// Main transformation process
function main() {
    try {
        // Read original working copy
        const rawData = fs.readFileSync(inputPath, "utf8");

        // Convert JSON text into JavaScript objects
        const products = JSON.parse(rawData);

        if (!Array.isArray(products)) {
            throw new Error("Product data must be an array.");
        }

        // Transform products
        const transformedProducts = transformProducts(products);

        // Save transformed data
        fs.writeFileSync(
            outputPath,
            JSON.stringify(transformedProducts, null, 2),
            "utf8"
        );

        console.log("\nTransformation completed successfully!");
        console.log("---------------------------------------");
        console.log(`Original records: ${products.length}`);
        console.log(`Transformed records: ${transformedProducts.length}`);
        console.log(`Unique IDs: ${new Set(transformedProducts.map(p => p.id)).size}`);
        console.log(`Output file: ${outputPath}`);

    } catch (error) {
        console.error("\nTransformation failed:", error.message);
        process.exitCode = 1;
    }
}

main();
