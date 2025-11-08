# Portfolio Website - Technology Stack

## Programming Languages
- **HTML5**: Semantic markup with modern web standards
- **CSS3**: Styling via Tailwind CSS framework
- **JavaScript (ES6+)**: Modern JavaScript with async/await, arrow functions, and DOM manipulation

## Frontend Technologies
- **Tailwind CSS**: Utility-first CSS framework delivered via CDN
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Vanilla JavaScript**: No framework dependencies for maximum performance

## External Services
- **Formspree**: Form handling service for contact form submissions
- **Tailwind CDN**: `https://cdn.tailwindcss.com` for styling
- **Formspree Endpoint**: `https://formspree.io/f/mrbopjyq` for form processing

## AWS Infrastructure
- **S3**: Static website hosting with public read access
- **CloudFront**: Global CDN for fast content delivery
- **IAM**: Identity and access management for deployment permissions
- **Route 53**: Optional custom domain configuration

## Development Tools
- **Git**: Version control system
- **GitHub**: Repository hosting and CI/CD platform
- **GitHub Actions**: Automated deployment pipeline
- **AWS CLI**: Command-line interface for AWS services

## Build and Deployment
- **No Build Process**: Direct file deployment to S3
- **GitHub Actions Workflow**: Automated sync to S3 and CloudFront invalidation
- **CloudFormation**: Infrastructure as Code for AWS resource management

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (ES6+ support required)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Core functionality works without JavaScript

## Performance Optimizations
- **CDN Delivery**: Tailwind CSS served from global CDN
- **Minimal Dependencies**: Only essential external resources loaded
- **Optimized Images**: Placeholder for future image optimization
- **Caching Strategy**: CloudFront caching for static assets