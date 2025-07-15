# Good Life Jain Foundation - Modern React Website

A modern, responsive React application dedicated to preserving and promoting the ancient Brahmi script, developed under the guidance of Shrutaradhak Sant Kshuallak Shri PragyanshSagar Ji Gurudev.

## 🌟 Features

### Core Functionality
- **Modern React Architecture** - Built with React 18, TypeScript, and Tailwind CSS
- **Live Brahmi Script Translator** - Real-time conversion of Hindi/English text to ancient Brahmi script
- **Interactive Timeline** - Learn the history of Brahmi script through an engaging 8-step animated story
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Smooth Animations** - Beautiful animations powered by Framer Motion
- **Accessible Design** - WCAG 2.1 compliant with proper ARIA labels
- **Component-based Architecture** - Maintainable and scalable codebase

### Technical Features
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Progressive Web App** capabilities
- **SEO optimized** with semantic HTML
- **Performance optimized** with code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd brahmi-foundation
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm start
# or
yarn start
```

4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

This creates a `build` folder with production-optimized files.

## 📁 Project Structure

```
brahmi-foundation/
├── public/
│   ├── assets/
│   │   ├── gallery/          # Gallery images
│   │   └── avatars/          # Profile pictures
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Hero, About, Tools, Translator
│   │   └── ui/               # Button, Card, Section, Icon
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Data and utility functions
│   ├── index.css             # Tailwind + custom styles
│   ├── App.tsx               # Main app component
│   └── index.tsx             # App entry point
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#d4af37` - Sacred and traditional
- **Dark Background**: `#0a0a0a` - Modern and elegant
- **Surface Colors**: Various grays for layered depth
- **Accent Orange**: `#ff6b35` - Call-to-action elements

### Typography
- **Sans-serif**: Inter (body text)
- **Serif**: Playfair Display (headings)
- **Brahmi**: Noto Sans Brahmi (script display)

### Component Architecture
- **Reusable UI Components** - Button, Card, Section, Icon
- **Layout Components** - Header, Footer
- **Section Components** - Hero, About, Tools, Translator
- **TypeScript Interfaces** - Full type safety

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Adding New Components

1. Create component in appropriate directory (`ui/`, `sections/`, or `layout/`)
2. Add TypeScript interfaces in `types/index.ts`
3. Export component and use in `App.tsx`

### Customizing Styles

1. **Tailwind Classes** - Use utility classes for styling
2. **Custom CSS** - Add to `index.css` using `@layer` directives
3. **Design Tokens** - Modify `tailwind.config.js` for colors, fonts, etc.

### Translation System

The Brahmi translator supports:
- **Hindi to Brahmi** - Character-by-character mapping
- **English to Brahmi** - Phonetic transliteration
- **Extensible Mappings** - Easy to add new character mappings

To extend translation:
1. Edit `brahmiMapping` or `englishToBrahmi` in `utils/data.ts`
2. Add new character mappings
3. Test with the translator component

## 📱 Features by Section

### Hero Section
- Full-screen video background
- Animated Brahmi script display
- Call-to-action buttons
- Video modal for story

### About Section
- Interactive 8-step timeline
- Statistics with animated counters
- Alternating layout for visual interest
- Call-to-action cards

### Tools Section
- Grid layout of available tools
- External links to existing tools
- Internal navigation to translator
- Feature highlights

### Translator Section
- Real-time translation
- Language selection (Hindi/English)
- Copy and download functionality
- Sample translations
- Speech synthesis support

## 🌐 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- **Features**: ES2020, CSS Grid, Flexbox, CSS Custom Properties
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🔒 Security & Privacy

- **No external tracking** scripts
- **Local state management** only
- **HTTPS recommended** for production
- **No personal data collection** without consent

## 🚀 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Code Splitting** with React.lazy()
- **Image Optimization** recommended
- **Bundle Analysis** with `npm run build`

## 📖 Content Management

### Adding Gallery Images
Place images in `public/assets/gallery/` and update `galleryData` in `utils/data.ts`:

```typescript
{
  id: 'new-image',
  title: 'Image Title',
  category: 'Category',
  image: '/assets/gallery/new-image.jpg',
  alt: 'Descriptive alt text'
}
```

### Updating Timeline
Modify `timelineData` in `utils/data.ts` to add or edit timeline steps.

### Managing Tools
Update `toolsData` in `utils/data.ts` to add new tools or modify existing ones.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript** - Full type safety
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Component Structure** - Follow established patterns

### Testing
- **Component Testing** - Test component behavior
- **Translation Testing** - Verify Brahmi mappings
- **Responsive Testing** - Test across devices

## 📞 Support

For technical support or questions:

- **Email**: goodlifejainfoundation@gmail.com
- **Guidance**: Shrutaradhak Sant Kshuallak Shri PragyanshSagar Ji Gurudev

## 🎯 Deployment

### Netlify (Recommended)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`

### Vercel
1. Import project from GitHub
2. Framework preset: Create React App
3. Deploy

### Traditional Hosting
1. Run `npm run build`
2. Upload `build` folder contents to web server
3. Configure redirects for single-page app

## 📄 License

This project is developed for the preservation and promotion of ancient Brahmi script heritage.

---

**Made with ❤️ for preserving ancient wisdom**
