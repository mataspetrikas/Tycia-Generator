const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const imagesDir = path.join(__dirname, '..', 'images');
const outputFile = path.join(__dirname, '..', 'images-data.json');

// Check if we should replace the entire file
const shouldReplace = process.argv.includes('--replace');

// Load existing data if available and not replacing
let existingData = [];
let existingMap = new Map();

if (!shouldReplace && fs.existsSync(outputFile)) {
  try {
    existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    // Create a map for quick lookup by path
    existingData.forEach(item => {
      existingMap.set(item.path, item);
    });
    console.log(`Loaded ${existingData.length} existing images from JSON`);
  } catch (error) {
    console.warn('Could not load existing JSON, starting fresh:', error.message);
  }
} else if (shouldReplace) {
  console.log('--replace flag detected, regenerating entire file');
}

// Read all files in the images directory
const files = fs.readdirSync(imagesDir);

// Filter only image files and get their dimensions
const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

const imagesData = [];
let newCount = 0;
let updatedCount = 0;
let keptCount = 0;

for (const file of imageFiles) {
  const filePath = path.join(imagesDir, file);
  const imagePath = `images/${file}`;

  try {
    const dimensions = sizeOf(filePath);
    const existingItem = existingMap.get(imagePath);

    if (existingItem) {
      // Keep existing data (including tags if present)
      // But update dimensions in case image was replaced
      existingItem.width = dimensions.width;
      existingItem.height = dimensions.height;
      imagesData.push(existingItem);
      keptCount++;
    } else {
      // New image - add without tags
      imagesData.push({
        path: imagePath,
        width: dimensions.width,
        height: dimensions.height
      });
      newCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

// Check for removed images
const removedCount = existingData.length - keptCount;

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(imagesData, null, 2));

console.log(`\nSummary:`);
console.log(`  Total images: ${imagesData.length}`);
console.log(`  New images added: ${newCount}`);
console.log(`  Existing images kept: ${keptCount}`);
if (removedCount > 0) {
  console.log(`  Images removed (file deleted): ${removedCount}`);
}
console.log(`\nUpdated ${outputFile}`);
