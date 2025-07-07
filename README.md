# BeReal AR Billboard Prototype

A web-based AR billboard prototype for BeReal's "Reveal Reality" campaign, featuring multi-route architecture, QR code integration, camera access with QR scanning, progressive blur-to-clear reveal animation, responsive design, and analytics tracking.

## Features

- **Multi-Page Architecture**: Three main routes (/, /reveal, /admin)
- **QR Code Integration**: Dynamic QR code generation linking to reveal page
- **Camera Access**: Mobile camera integration with QR scanning capabilities
- **Progressive Reveal Animation**: Blur-to-clear reveal effect for content
- **Responsive Design**: Optimized for desktop and mobile devices
- **Content Management**: Admin dashboard for managing billboard content
- **Analytics Tracking**: User interaction and engagement analytics
- **URL-Based Content**: Each content piece accessible via unique URLs

## Pages

### Main Billboard (`/`)
- Displays rotating billboard content
- QR code linking to reveal page
- BeReal logo integration
- URL parameter support for specific content (`/?content=ID`)

### Reveal Page (`/reveal`)
- Camera access for QR scanning
- Progressive blur-to-clear reveal animation
- Desktop demo mode with test button
- Mobile-optimized AR experience

### Admin Dashboard (`/admin`)
- Content management interface
- View page links for each content piece
- Analytics overview
- Content preview functionality

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **3D Graphics**: Three.js
- **QR Code**: qrcode.js, qr-scanner
- **Styling**: Custom CSS with responsive design
- **Deployment**: Railway-ready configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/br00kd0wnt0n/BeReal_AR_test.git
cd BeReal_AR_test
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Railway Deployment

This project is configured for Railway deployment:

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. The app will be built and deployed automatically

### Environment Variables

- `PORT`: Server port (automatically set by Railway)

## Project Structure

```
BeReal/
├── index.html              # Main billboard page
├── reveal.html             # AR reveal page
├── admin.html              # Admin dashboard
├── scripts/
│   ├── billboard.js        # Main billboard functionality
│   ├── reveal.js           # Reveal page logic
│   ├── admin.js            # Admin dashboard
│   ├── camera.js           # Camera management
│   ├── qr-generator.js     # QR code generation
│   └── analytics.js        # Analytics tracking
├── styles/
│   ├── billboard.css       # Main page styles
│   ├── reveal.css          # Reveal page styles
│   └── admin.css           # Admin styles
├── public/
│   └── _redirects          # Netlify redirects
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── railway.json            # Railway deployment config
└── README.md               # This file
```

## Usage

### Content Management

1. Access the admin dashboard at `/admin`
2. Use "View Page" buttons to access specific content
3. Content is managed via URL parameters

### QR Code Integration

- QR codes automatically link to the reveal page
- Mobile users can scan QR codes to access AR experience
- Desktop users can click QR codes for demo mode

### Analytics

- User interactions are tracked automatically
- Analytics data is available in the admin dashboard
- Page views and engagement metrics are recorded

## Browser Support

- Chrome/Chromium (recommended for AR features)
- Firefox
- Safari
- Edge

## Mobile Support

- iOS Safari (with camera permissions)
- Android Chrome (with camera permissions)
- Progressive Web App capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub.

---

**BeReal AR Billboard Prototype** - Reveal Reality Campaign 