const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const imagesDir = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'images-data.json');

// Read all files in the images directory
const files = fs.readdirSync(imagesDir);

// Filter only image files and get their dimensions
const imagesData = files
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
  .map(file => {
    const filePath = path.join(imagesDir, file);
    try {
      const dimensions = sizeOf(filePath);
      return {
        path: `images/${file}`,
        width: dimensions.width,
        height: dimensions.height
      };
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      return null;
    }
  })
  .filter(item => item !== null);

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(imagesData, null, 2));

console.log(`Generated ${outputFile} with ${imagesData.length} images`);
