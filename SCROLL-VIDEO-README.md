# Scroll Video Block for Shopify

A powerful and customizable video block that plays only while scrolling, using GSAP ScrollTrigger for smooth animations.

## Features

### 🎬 Core Video Functionality
- **Scroll-Controlled Playback**: Video plays only when scrolling, pauses when scroll stops
- **Video Scrubbing**: Video progress is synchronized with scroll position
- **Multiple Video Sources**: Support for uploaded files or direct URL links
- **Responsive Design**: Optimized for all screen sizes

### ⚡ Performance & Optimization
- **GSAP ScrollTrigger**: Industry-standard scroll animation library
- **Smooth Animations**: Configurable scrub smoothness (0.1s - 3s)
- **Mobile Touch Controls**: Enhanced touch scrolling for mobile devices
- **Speed-Based Playback**: Optional video speed adjustment based on scroll velocity
- **Efficient Loading**: Optimized video loading and metadata handling

### 🎨 Customization Options
- **Layout Control**: Adjustable height, width, and border radius
- **Overlay Effects**: Optional gradient overlay with customizable colors
- **Content Overlay**: Title and description with animation effects
- **Progress Indicator**: Visual progress bar showing video completion
- **Color Customization**: Full control over all colors and text styling

### 📱 Mobile & Accessibility
- **Touch Optimized**: Enhanced mobile touch controls
- **Responsive Heights**: Different heights for desktop and mobile
- **Autoplay Handling**: Graceful handling of browser autoplay restrictions
- **Error States**: User-friendly error handling for failed video loads

## Installation

1. **Add the Block File**
   - Copy `scroll-video.liquid` to your theme's `blocks/` folder

2. **Add the JavaScript Asset**
   - Copy `scroll-video.js` to your theme's `assets/` folder

3. **GSAP Dependencies**
   - GSAP and ScrollTrigger are loaded via CDN (included in the block)
   - No additional setup required

## Usage

### Basic Setup
1. Go to Theme Customizer
2. Add a new section or edit an existing one
3. Add the "Scroll Video" block
4. Upload a video or provide a video URL
5. Configure settings as needed

### Video Requirements
- **Format**: MP4 recommended
- **Size**: Optimize for web (recommended max 50MB)
- **Dimensions**: 1920x1080 or 1280x720 recommended
- **Length**: 10-30 seconds works best for scroll videos

### Configuration Options

#### Video Settings
- **Video URL**: Direct link to MP4 file
- **Video File**: Upload MP4 file directly
- **Object Fit**: How video fits container (cover, contain, fill)
- **Object Position**: Video alignment (center, top, bottom, left, right)

#### Scroll Settings
- **Scrub Smoothness**: 0.1-3 seconds (lower = more responsive)
- **Speed-based Playback**: Adjust video speed based on scroll velocity
- **Mobile Touch Control**: Enhanced touch scrolling optimization

#### Layout
- **Block Height**: 50-150vh
- **Mobile Height**: 40-100vh
- **Max Width**: 800-2000px
- **Border Radius**: 0-30px
- **Background Color**: Container background

#### Overlay
- **Show Overlay**: Enable/disable gradient overlay
- **Overlay Color**: Gradient color
- **Overlay Opacity**: 0-1 opacity level

#### Content
- **Show Content**: Enable/disable text overlay
- **Title**: Main heading text
- **Description**: Subtitle/description text
- **Title Size**: 16-60px
- **Description Size**: 12-24px
- **Title Weight**: Font weight options
- **Text Color**: Text color for overlay content

#### Progress Indicator
- **Show Progress**: Enable/disable progress bar
- **Progress Color**: Progress bar color

## Best Practices

### Video Optimization
```
Recommended Settings:
- Resolution: 1920x1080 or 1280x720
- Frame Rate: 30fps
- Bitrate: 2-5 Mbps
- Format: MP4 (H.264)
- Duration: 10-30 seconds
```

### Performance Tips
- Use compressed videos (tools like HandBrake)
- Consider multiple video formats for browser compatibility
- Test on mobile devices for performance
- Keep videos under 50MB when possible

### Design Guidelines
- Use high contrast text colors for readability
- Test overlay visibility against video content
- Consider mobile viewport when setting heights
- Use progress indicator to show interaction feedback

## Troubleshooting

### Video Not Playing
1. Check video format (MP4 recommended)
2. Verify video URL is accessible
3. Test in different browsers
4. Check browser autoplay policies

### Performance Issues
1. Reduce video file size
2. Increase scrub smoothness value
3. Disable speed-based playback
4. Test on different devices

### Mobile Issues
1. Enable mobile touch controls
2. Adjust mobile height settings
3. Test touch scrolling behavior
4. Consider reducing video quality for mobile

## Advanced Customization

### Custom JavaScript
```javascript
// Access the ScrollVideoComponent instance
const video = document.getElementById('scroll-video-[your-id]');
const component = new ScrollVideoComponent(video, {
  scrubSmoothness: 1.5,
  speedBasedPlayback: true,
  mobileTouch: true,
  showProgress: true
});
```

### Custom CSS
```css
/* Override default styles */
.scroll-video-container-[your-id] {
  /* Custom container styles */
}

.scroll-video-[your-id] {
  /* Custom video styles */
}
```

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 13+)
- **Edge**: Full support
- **Mobile**: iOS 13+, Android 8+

## Dependencies

- **GSAP**: 3.12.5+ (loaded via CDN)
- **ScrollTrigger**: 3.12.5+ (loaded via CDN)
- **Modern Browser**: ES6+ support required

## File Structure

```
blocks/
  scroll-video.liquid          # Main block file
assets/
  scroll-video.js             # JavaScript functionality
scroll-video-demo.html        # Demo/example file
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Test with different videos and settings
3. Verify GSAP is loading correctly
4. Check browser console for errors

## License

This block is free to use and modify for your Shopify themes.
