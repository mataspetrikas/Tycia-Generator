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
├── build/                 # Compiled output
│   ├── generator.swf     # Main SWF file
│   ├── index.html        # HTML wrapper
│   └── images/           # Static assets (logo, etc.)
├── config/               # Build configuration
│   └── font-config.xml   # Font embedding config
├── src/                  # Source code
│   ├── com/
│   │   ├── adobe/        # Adobe utility libraries
│   │   └── liksaite/
│   │       └── generator/
│   │           ├── GenCanvas.as    # Bitmap canvas for image mosaics
│   │           ├── IngaGen.as      # Main application class
│   │           └── TextCanvas.as   # Text display component
│   └── gs/               # GreenSock animation library
└── README.md             # This file
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
