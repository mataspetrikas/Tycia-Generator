#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths relative to web-app directory
const rootDir = path.join(__dirname, '../..');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy JSON data files
const jsonFiles = ['images-data.json', 'text-data.json'];
jsonFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(publicDir, file);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ ${file} not found`);
  }
});

// Copy images directory
const imagesDir = path.join(rootDir, 'images');
const destImagesDir = path.join(publicDir, 'images');

if (fs.existsSync(imagesDir)) {
  // Remove existing images directory if it exists
  if (fs.existsSync(destImagesDir)) {
    fs.rmSync(destImagesDir, { recursive: true });
  }

  // Copy images directory
  fs.cpSync(imagesDir, destImagesDir, { recursive: true });

  // Count copied files
  const imageFiles = fs.readdirSync(destImagesDir);
  console.log(`✓ Copied ${imageFiles.length} images`);
} else {
  console.warn('⚠ images directory not found');
}

console.log('\n✓ Assets copied successfully');
