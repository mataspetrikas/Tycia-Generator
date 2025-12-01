# Tycia Generator

An interactive generative art installation created for Lithuanian artist Inga Liksaite's project "Tekstai yra čia" (Texts are here).

## Description

This project is a Flash-based application that creates dynamic visual art by combining images and text in real-time. It fetches images from Flickr tagged with "tekstaiyracia" and text content from the Tumblr blog [tekstaiyracia.tumblr.com](http://tekstaiyracia.tumblr.com). The application generates mosaic patterns from the images and overlays scrolling text, creating an evolving visual experience.

The artwork explores themes of text, imagery, and their intersection in digital space, reflecting Inga Liksaite's artistic vision.

## Features

- Real-time image loading from Flickr API
- Dynamic text generation from Tumblr posts
- Generative bitmap mosaics using sampled image data
- Smooth animations with GreenSock TweenLite
- Fullscreen mode support
- Embedded fonts for consistent typography

## Technical Details

- **Language**: ActionScript 3.0
- **Framework**: Adobe Flash/Flex
- **Libraries**:
  - GreenSock TweenLite/TweenMax for animations
  - Adobe Core Libraries (crypto, images, net, utils, etc.)
  - JSON serialization
- **APIs**: Flickr Public Feeds API, Tumblr API
- **Output**: SWF file embedded in HTML

## Project Structure

```
├── flash-app/            # Legacy Flash application
│   ├── build/            # Compiled Flash output
│   ├── config/           # Build configuration
│   └── src/              # ActionScript 3.0 source code
├── images/               # Image assets from Flickr archive
├── scripts/              # Image management tools
│   ├── generate-images-json.js  # List images with dimensions
│   ├── classify-clip.js         # CLIP AI classification
│   └── classify-images.js       # MobileNet classification
├── images-data.json      # Generated image metadata with AI tags
├── text-data.json        # Text content from Tumblr
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

## Image Management & Classification

This project includes tools to manage and classify images using AI. The images are stored in the `images/` folder and metadata is maintained in `images-data.json`.

### Initial Setup

Install dependencies:
```bash
npm install
```

### Listing Images

Generate or update the image metadata JSON file:

```bash
npm run generate-images
```

This command is **non-destructive**:
- Adds new images found in the `images/` folder
- Keeps existing images and their tags
- Removes entries for deleted image files
- Updates dimensions if an image file was replaced

To completely regenerate the file (removing all existing tags):
```bash
npm run generate-images:replace
```

### Classifying Images

Classify images into semantic categories using CLIP AI model:

```bash
npm run classify-clip
```

This adds tags to each image in 5 categories:
- **people** - Images with people
- **artwork** - Artistic content
- **exhibition** - Exhibition/gallery photos
- **texts** - Images with visible text
- **object** - Objects and things

Each category gets a confidence score (0-100%).

**Note**: First run downloads the CLIP model (~350MB). Subsequent runs are faster.

### Combined Workflow

To add new images and classify them in one command:

```bash
npm run update
```

This runs `generate-images` (non-destructive) followed by `classify-clip`.

### Alternative: MobileNet Classification

For more specific object classification (1000+ categories like "laptop", "car", etc.):

```bash
npm run classify-images
```

**Recommendation**: Use `classify-clip` for semantic categorization.

### Using the Data

Load `images-data.json` in your web application:

```javascript
// Fetch image data
const images = await fetch('images-data.json').then(r => r.json());

// Filter by category
const exhibitions = images.filter(img =>
  img.tags[0].label === 'exhibition'
);

// Find high-confidence matches
const peopleImages = images.filter(img =>
  img.tags.some(tag => tag.label === 'people' && tag.confidence > 50)
);

// Access image properties
images.forEach(img => {
  console.log(img.path);       // "images/photo.jpg"
  console.log(img.width);      // 1024
  console.log(img.height);     // 768
  console.log(img.tags);       // [{label: "exhibition", confidence: 96}, ...]
});
```

## Building

This project requires the Adobe Flex SDK to compile. To build:

1. Install Adobe Flex SDK (or Apache Flex SDK)
2. Set up your development environment
3. Compile with mxmlc using the font config:

```bash
mxmlc -load-config+=config/font-config.xml src/com/liksaite/generator/IngaGen.as -output build/generator.swf
```

Note: The project embeds system fonts (Helvetica) and requires appropriate font ranges for European characters.

## Running

Open `build/index.html` in a web browser with Flash Player support. The application will:

1. Load images from Flickr tagged "tekstaiyracia"
2. Fetch text posts from the Tumblr blog
3. Generate animated mosaics and scrolling text
4. Click anywhere to enter fullscreen mode

## Dependencies

- Adobe Flash Player (legacy - no longer supported)
- Internet connection for API access
- Flickr API access (public feeds)
- Tumblr API access

## Author

- **Code**: Matas Petrikas
- **Art**: Inga Liksaite
- **Poetry**: Rolandas Rastauskas

## License

© Matas Petrikas

## Notes

This is a legacy Flash project. Adobe Flash Player is deprecated and no longer supported by modern browsers. For contemporary use, the project would need to be migrated to modern web technologies (HTML5 Canvas, WebGL, etc.).

The Tumblr blog "tekstaiyracia.tumblr.com" and associated Flickr content may no longer be accessible or active.
