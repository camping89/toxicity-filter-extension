# Enhanced News Toxicity Filter

A browser extension that detects and filters potentially toxic content in news articles and web pages using pattern matching and configurable sensitivity levels.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Testing](#testing)
- [Code Structure](#code-structure)
- [Future Improvements](#future-improvements)

## Features

- Real-time content filtering
- Configurable toxicity levels (High, Medium, Low)
- Custom pattern matching
- Statistics tracking
- Visual indicators for filtered content
- Options page for customization

## Installation

1. Clone this repository
2. Open Chrome/Firefox and navigate to extensions
3. Enable Developer Mode
4. Load unpacked extension from the project directory
5. The extension icon should appear in your browser toolbar

## Testing

### Using the Test Page
1. Open `test.html` in your browser
2. Use the control buttons to:
   - Toggle filter on/off
   - View filtering statistics
   - Test different toxicity patterns

### Updating Filters

You can update filters in two ways:

1. **Via Options Page**
   - Access extension options
   - Adjust sensitivity thresholds
   - Add/remove custom patterns

2. **Direct Code Update**
   - Modify patterns in `bundle.js`
   - Update toxicity levels
   - Add new pattern categories

## Code Structure

### Core Components

1. **ContentFilter Class (`bundle.js`)**
   - Manages DOM content processing
   - Handles event listeners
   - Controls filter toggling
   - Processes paragraphs for toxic content

2. **Configuration**
   - Toxicity level thresholds
   - Visual styling settings
   - Debug options
   - Statistics tracking

3. **User Interface**
   - Options page (`options.html`)
   - Custom pattern management
   - Sensitivity controls
   - Statistics display

## Future Improvements

### AI-Enhanced Filtering

1. **RAG Integration**
   - Dynamic pattern learning
   - Context-aware detection
   - Vector database integration for pattern matching

2. **Machine Learning Features**
   - Automated pattern discovery
   - Sentiment analysis
   - Multi-language support
   - Regular model updates

### Best Practices

1. **Performance**
   - Use debouncing for real-time filtering
   - Implement Web Workers for heavy processing
   - Cache frequently used patterns

2. **Security**
   - Sanitize regular expressions
   - Validate user inputs
   - Implement rate limiting

3. **Code Quality**
   - Maintain modular structure
   - Write comprehensive documentation
   - Include unit tests