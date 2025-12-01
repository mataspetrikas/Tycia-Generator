const fs = require('fs');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

// Custom categories
const CATEGORIES = [
  'people',
  'artwork',
  'exhibition',
  'texts',
  'object'
];

// Load the images-data.json file
const imagesDataPath = path.join(__dirname, '..', 'images-data.json');
const imagesData = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

// Main classification function
async function classifyWithCLIP() {
  console.log('Loading CLIP model...');
  console.log('(This may take a few minutes on first run as the model downloads)\n');

  // Initialize the zero-shot classification pipeline
  const classifier = await pipeline('zero-shot-image-classification',
    'Xenova/clip-vit-base-patch32');

  console.log('Model loaded successfully!\n');

  let processedCount = 0;

  for (const imageData of imagesData) {
    const imagePath = path.join(__dirname, '..', imageData.path);

    try {
      console.log(`Classifying ${imageData.path}...`);

      // Classify image against our custom categories
      const results = await classifier(imagePath, CATEGORIES);

      // Sort by confidence score (descending)
      results.sort((a, b) => b.score - a.score);

      // Store the results with confidence scores
      imageData.tags = results.map(result => ({
        label: result.label,
        confidence: Math.round(result.score * 100)
      }));

      // Show top 3 predictions
      const topThree = results.slice(0, 3)
        .map(r => `${r.label} (${Math.round(r.score * 100)}%)`)
        .join(', ');
      console.log(`  Top tags: ${topThree}`);

      processedCount++;
    } catch (error) {
      console.error(`  Error processing ${imageData.path}:`, error.message);
      imageData.tags = [];
    }
  }

  // Save updated data
  fs.writeFileSync(imagesDataPath, JSON.stringify(imagesData, null, 2));
  console.log(`\nCLIP classification complete! Processed ${processedCount}/${imagesData.length} images.`);
  console.log(`Updated ${imagesDataPath}`);
}

// Run the classification
classifyWithCLIP().catch(console.error);
