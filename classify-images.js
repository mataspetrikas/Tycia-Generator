const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const jpeg = require('jpeg-js');

// Load the images-data.json file
const imagesDataPath = path.join(__dirname, 'images-data.json');
const imagesData = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

// Function to load and decode image
function loadImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const rawImageData = jpeg.decode(imageBuffer, { useTArray: true });

  // Convert to tensor
  const imageTensor = tf.browser.fromPixels(rawImageData);
  return imageTensor;
}

// Main classification function
async function classifyImages() {
  console.log('Loading MobileNet model...');
  const model = await mobilenet.load();
  console.log('Model loaded successfully!\n');

  let processedCount = 0;

  for (const imageData of imagesData) {
    const imagePath = path.join(__dirname, imageData.path);

    try {
      console.log(`Classifying ${imageData.path}...`);

      // Load image as tensor
      const img = loadImage(imagePath);

      // Get predictions (top 3 predictions)
      const predictions = await model.classify(img);

      // Clean up tensor
      img.dispose();

      // Extract tags from predictions with confidence scores
      imageData.tags = predictions.map(pred => ({
        label: pred.className,
        confidence: Math.round(pred.probability * 100)
      }));

      console.log(`  Tags: ${predictions.map(p => `${p.className} (${Math.round(p.probability * 100)}%)`).join(', ')}`);

      processedCount++;
    } catch (error) {
      console.error(`  Error processing ${imageData.path}:`, error.message);
      imageData.tags = [];
    }
  }

  // Save updated data
  fs.writeFileSync(imagesDataPath, JSON.stringify(imagesData, null, 2));
  console.log(`\nClassification complete! Processed ${processedCount}/${imagesData.length} images.`);
  console.log(`Updated ${imagesDataPath}`);
}

// Run the classification
classifyImages().catch(console.error);
