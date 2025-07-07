# BeReal AR Billboard Prototype

A deployable web-based AR billboard prototype for BeReal's "Reveal Reality" campaign that demonstrates their authentic social media concept through interactive QR code scanning and progressive blur-to-clear reveal animations.

## 🎯 Project Overview

This prototype creates an immersive experience where users scan a QR code to trigger a beautiful blur-to-clear reveal animation, demonstrating the concept of "revealing reality" when you're ready to be authentic.

## ✨ Key Features

- **QR Code Integration**: Dynamic QR code generation pointing to reveal experience
- **Camera Integration**: Real-time camera access with QR code detection
- **Progressive Reveal Animation**: Smooth 4-second blur-to-clear transition
- **Particle Effects**: Enhanced visual appeal with floating particles
- **Responsive Design**: Mobile-first approach with touch-friendly interface
- **Analytics Integration**: Comprehensive event tracking and user engagement metrics
- **Content Management**: Dynamic content rotation with multiple authentic moments

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with camera access

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bereal-ar-billboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Start development server with hot reload
npm run dev

# The app will be available at http://localhost:3000
```

## 📱 Usage

### Billboard View (`/`)

1. **View the billboard** displaying blurred authentic moments
2. **Scan the QR code** with your camera app or click "Try Demo Experience"
3. **Watch content rotate** automatically every 30 seconds
4. **Use controls** to manually change content or refresh QR code

### Reveal Experience (`/reveal`)

1. **Allow camera access** when prompted
2. **Point camera at billboard** or QR code
3. **Experience the reveal** - progressive blur removal with particle effects
4. **View final CTA** encouraging BeReal app download

## 🏗️ Architecture

### File Structure

```
bereal-ar-billboard/
├── index.html              # Billboard display
├── reveal.html             # AR reveal experience
├── package.json            # Dependencies and scripts
├── vite.config.js          # Build configuration
├── netlify.toml           # Deployment configuration
├── styles/
│   ├── billboard.css      # Billboard styling
│   └── reveal.css         # Reveal animation styles
├── scripts/
│   ├── qr-generator.js    # QR code generation
│   ├── billboard.js       # Billboard functionality
│   ├── camera.js          # Camera access & QR detection
│   ├── reveal.js          # Reveal animations
│   └── analytics.js       # Event tracking
└── README.md              # Documentation
```

### Core Modules

#### QR Generator (`qr-generator.js`)
- Dynamic QR code generation using `qrcode` library
- Points to `/reveal` route with current domain
- Fallback functionality for unsupported browsers

#### Billboard Manager (`billboard.js`)
- Content rotation every 30 seconds
- 5 different authentic moments
- Event tracking and user interaction handling

#### Camera Manager (`camera.js`)
- Camera access using `getUserMedia()`
- QR code detection with `qr-scanner` library
- Computer vision simulation for billboard detection

#### Reveal Manager (`reveal.js`)
- Progressive blur removal animation
- Particle effects and clarity wave animations
- CTA overlay with BeReal app integration

#### Analytics (`analytics.js`)
- Comprehensive event tracking
- Performance metrics
- Session management
- Local storage for demo purposes

## 🎨 Design System

### Color Palette
- **Primary**: `#ff6b6b` (Coral Red)
- **Secondary**: `#feca57` (Golden Yellow)
- **Accent**: `#48dbfb` (Sky Blue)
- **Background**: `#667eea` to `#764ba2` (Purple Gradient)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 600, 700
- **Responsive**: Scales from 1rem to 3.5rem

### Animations
- **Reveal Duration**: 4 seconds
- **Blur Steps**: 25px → 18px → 12px → 6px → 0px
- **Particle Effects**: 4-second floating animation
- **Clarity Wave**: Radial expansion with 3 layers

## 📊 Analytics Events

The prototype tracks comprehensive user interactions:

### Page Events
- `page_viewed` - Page load tracking
- `session_started` - Session initialization
- `performance_metrics` - Load time and paint metrics

### User Interactions
- `qr_code_clicked` - QR code interaction
- `demo_experience_clicked` - Demo button clicks
- `content_manually_changed` - Manual content rotation
- `qr_code_refreshed` - QR code regeneration

### Camera & Reveal
- `camera_initialized` - Camera setup success
- `camera_access_granted` - Permission granted
- `qr_code_detected` - QR code scanning
- `reveal_triggered` - Reveal animation start
- `reveal_completed` - Animation completion
- `bereal_cta_clicked` - App download CTA

### Error Tracking
- `camera_error` - Camera access failures
- `error` - General error tracking

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables** (if needed)
4. **Deploy automatically** on git push

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your hosting service
# Copy contents of `dist/` folder to your web server
```

### Environment Variables

```bash
# Optional: Analytics service keys
VITE_GA_TRACKING_ID=your-ga-id
VITE_MIXPANEL_TOKEN=your-mixpanel-token
```

## 🔧 Configuration

### Content Management

Edit `scripts/billboard.js` and `scripts/reveal.js` to modify authentic moments:

```javascript
this.authenticMoments = [
    {
        id: 1,
        background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb)',
        title: '✨ Authentic Moment ✨',
        subtitle: 'Real friendship, unfiltered',
        description: 'When you\'re ready to be real, everything becomes clear'
    },
    // Add more moments...
];
```

### Animation Timing

Modify reveal animation duration in `scripts/reveal.js`:

```javascript
const revealSteps = [
    { blur: 25, brightness: 0.7, duration: 1000 }, // 1 second per step
    // ... more steps
];
```

### QR Code Settings

Adjust QR code appearance in `scripts/qr-generator.js`:

```javascript
const qrDataURL = await QRCode.toDataURL(this.revealUrl, {
    width: 140,           // Size in pixels
    margin: 2,            // Border margin
    color: {
        dark: '#000000',  // Dark color
        light: '#FFFFFF'  // Light color
    },
    errorCorrectionLevel: 'M' // Error correction
});
```

## 🧪 Testing

### Device Testing Checklist

- [ ] iPhone Safari (iOS 14+)
- [ ] Android Chrome (Android 8+)
- [ ] iPad landscape/portrait
- [ ] Desktop browsers (fallback experience)

### Functionality Testing

- [ ] QR code generation and scanning
- [ ] Camera access permissions
- [ ] Blur reveal animation smoothness
- [ ] Network connectivity handling
- [ ] Offline experience (if applicable)

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Animation frame rate > 30fps
- [ ] Memory usage < 100MB
- [ ] Battery usage optimization

## 🔒 Security & Privacy

### Camera Permissions
- Only requests camera access when needed
- No video/image data is stored or transmitted
- Camera streams are cleared when done

### Data Collection
- No personal data collected
- Analytics events are anonymous
- Local storage only for demo purposes

### Content Security
- CSP headers configured for camera access
- XSS protection enabled
- Frame options set to prevent embedding

## 🐛 Troubleshooting

### Common Issues

**Camera not working:**
- Ensure HTTPS connection (required for camera access)
- Check browser permissions
- Try refreshing the page

**QR code not scanning:**
- Ensure good lighting
- Hold camera steady
- Try demo mode as fallback

**Animation not smooth:**
- Check device performance
- Reduce particle count in code
- Disable other browser tabs

### Debug Mode

Enable debug logging in browser console:

```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Analytics Dashboard

Access analytics data in browser console:

```javascript
// Get all analytics data
const data = getAnalyticsData();
console.log(data);

// View session summary
console.log(data.summary);

// Export data for analysis
const jsonData = JSON.stringify(data, null, 2);
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BeReal team for the authentic social media concept
- QR Scanner library for camera integration
- Vite for fast development and building
- Netlify for seamless deployment

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**BeReal AR Billboard Prototype** - Revealing reality, one scan at a time. 📱✨ 