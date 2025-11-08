# Portfolio Website - Project Structure

## Directory Structure
```
portfolio-website/
├── .amazonq/
│   └── rules/
│       └── memory-bank/          # AI assistant documentation
├── README/
│   ├── README-cloudformation.md  # CloudFormation deployment guide
│   └── README-manual.md          # Manual AWS setup guide
├── .gitignore                    # Git ignore patterns
├── cloudformation.yaml           # AWS infrastructure as code
├── index.html                    # Main portfolio page
├── projects.js                   # Project data and display logic
└── script.js                     # Interactive functionality
```

## Core Components

### Frontend Files
- **index.html**: Single-page application containing all sections (hero, about, projects, contact)
- **projects.js**: Modular project data management and dynamic rendering
- **script.js**: Interactive features including mobile navigation and form handling

### Infrastructure Files
- **cloudformation.yaml**: Complete AWS infrastructure definition (S3, CloudFront, IAM)
- **README/**: Comprehensive deployment documentation for both automated and manual setups

### Configuration Files
- **.gitignore**: Standard web project exclusions
- **.amazonq/**: AI assistant memory bank for development guidance

## Architectural Patterns

### Single Page Application (SPA)
- All content contained in index.html with JavaScript-driven interactivity
- Section-based navigation using anchor links and smooth scrolling
- Mobile-responsive design with collapsible navigation

### Modular JavaScript Architecture
- Separation of concerns: projects.js handles data, script.js handles interactions
- Event-driven programming with DOM manipulation
- Async/await pattern for form submissions

### Static Site Deployment
- Client-side only architecture suitable for CDN deployment
- No server-side dependencies beyond form handling service
- Optimized for AWS S3 + CloudFront hosting

## Component Relationships

### Data Flow
1. **projects.js** → Defines project data array → Renders project cards to DOM
2. **script.js** → Handles user interactions → Updates UI state
3. **index.html** → Provides structure → Loads JavaScript modules

### External Dependencies
- **Tailwind CSS**: CDN-delivered styling framework
- **Formspree**: Third-party form handling service
- **AWS Services**: S3 for hosting, CloudFront for distribution

## Deployment Architecture
- **Development**: Local file system with browser preview
- **Production**: AWS S3 static website with CloudFront CDN
- **CI/CD**: GitHub Actions automated deployment pipeline