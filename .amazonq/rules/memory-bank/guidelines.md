# Portfolio Website - Development Guidelines

## Code Quality Standards

### JavaScript Conventions
- **ES6+ Syntax**: Use const/let instead of var, arrow functions, template literals
- **Camel Case Naming**: Variables and functions use camelCase (menuBtn, contactForm, displayProjects)
- **Descriptive Names**: Clear, self-documenting variable names (mobileMenu, projectsContainer, formMessage)
- **Single Responsibility**: Each function handles one specific task

### Code Formatting Patterns
- **Consistent Indentation**: 2-space indentation throughout JavaScript files
- **Line Spacing**: Empty lines separate logical code blocks
- **Comment Style**: Single-line comments with descriptive explanations
- **String Literals**: Double quotes for strings, template literals for interpolation

### DOM Manipulation Standards
- **Element Selection**: Use getElementById for unique elements, querySelectorAll for collections
- **Event Handling**: Arrow functions for event listeners with clear event parameter names
- **Class Management**: Use classList.toggle() and classList.add() for dynamic styling
- **Content Updates**: Use textContent for text, innerHTML for HTML content

## Structural Conventions

### File Organization
- **Separation of Concerns**: Data (projects.js), interactions (script.js), structure (index.html)
- **Module Loading**: Script tags at end of body for proper DOM loading
- **External Dependencies**: CDN links in head section

### HTML Structure Patterns
- **Semantic Elements**: Use section, nav, footer for proper document structure
- **ID Naming**: Descriptive IDs matching JavaScript selectors (contactForm, projectsContainer)
- **Class Naming**: Tailwind utility classes with consistent spacing and color schemes
- **Accessibility**: Proper form labels, semantic navigation structure

## Implementation Patterns

### Async Operations
- **Modern Async/Await**: Use async/await pattern for API calls instead of promises
- **Error Handling**: Try-catch blocks for all async operations
- **User Feedback**: Immediate UI updates for loading states and results

### Dynamic Content Generation
- **Template Literals**: Multi-line HTML templates using backticks
- **Array Methods**: Use map() and join() for generating repeated elements
- **DOM Creation**: createElement() and appendChild() for dynamic elements

### Event-Driven Architecture
- **DOMContentLoaded**: Wait for DOM ready before executing display functions
- **Event Delegation**: Attach listeners to parent elements where appropriate
- **State Management**: Use CSS classes for UI state changes

## Styling Guidelines

### Tailwind CSS Usage
- **Utility Classes**: Prefer utility classes over custom CSS
- **Responsive Design**: Mobile-first with md: and lg: breakpoints
- **Color Scheme**: Consistent slate-900/800/700 background with blue-400/500 accents
- **Spacing**: Consistent padding (p-4, p-6) and margins (mb-2, mb-4, mb-8)

### Component Styling Patterns
- **Card Components**: bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition
- **Interactive Elements**: hover states with color transitions
- **Form Elements**: Consistent border-slate-600 with focus:border-blue-400

## API Integration Standards

### External Service Integration
- **Formspree Integration**: POST requests with FormData and proper headers
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Success Feedback**: Clear confirmation messages with auto-clearing timeouts

### Data Management
- **Static Data**: Use const arrays for project data with consistent object structure
- **Data Validation**: Required form fields with proper input types
- **Content Security**: Avoid direct HTML injection, use textContent when possible