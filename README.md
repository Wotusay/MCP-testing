# Angular Team Project

[![CI/CD Pipeline](https://github.com/Wotusay/MCP-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/Wotusay/MCP-testing/actions/workflows/ci.yml)

A modern Angular 20 application built for collaborative team development, featuring Tailwind CSS for styling, comprehensive testing, and automated CI/CD pipeline.

## 🚀 Features

- **Angular 20** with zoneless architecture (Developer Preview)
- **Tailwind CSS** for utility-first styling
- **TypeScript** in strict mode for type safety
- **Shared Component Library** with reusable UI components  
- **Comprehensive Testing** with Karma/Jasmine (91%+ coverage)
- **Code Quality** with ESLint + Prettier + Husky hooks
- **CI/CD Pipeline** with GitHub Actions
- **Responsive Design** with mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: Angular 20 with TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Karma + Jasmine
- **Code Quality**: ESLint + Prettier + Husky
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

## ⚡ Quick Start

### Prerequisites
- Node.js 20.19.4+ (managed with NVM)
- npm 10.8.2+

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd angular-team-project
   ```

2. **Set up Node.js version:**
   ```bash
   nvm use 20
   # If you don't have Node.js 20 installed:
   nvm install 20
   nvm use 20
   nvm alias default 20
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   ng serve
   # or
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:4200/`

## 🛠️ Development Commands

### Development server
```bash
ng serve
# or
npm start
```
Navigate to `http://localhost:4200/`. The application will auto-reload when you modify source files.

### Build
```bash
ng build          # Development build
ng build --prod   # Production build
```

### Testing
```bash
npm test          # Run unit tests with watch mode
npm run test:ci   # Run tests once (CI mode)
ng e2e            # Run end-to-end tests
```

### Code Quality
```bash
npm run lint            # Check for ESLint errors
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
```

### Generate Code
```bash
ng generate component component-name
ng generate service service-name
ng generate --help  # See all available schematics
```

## 📁 Project Structure

```
angular-team-project/
├── src/
│   ├── app/
│   │   ├── shared/              # Shared components library
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── button/      # Button component
│   │   │   │   ├── feature-card/# Feature card component
│   │   │   │   ├── status-badge/# Status badge component
│   │   │   │   └── status-indicator/ # Status indicator
│   │   │   └── README.md        # Component documentation
│   │   ├── components/          # Feature-specific components
│   │   ├── services/            # Application services
│   │   ├── models/              # TypeScript interfaces/types
│   │   ├── guards/              # Route guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── pipes/               # Custom pipes
│   │   ├── app.component.*      # Root component
│   │   ├── app.config.ts        # App configuration
│   │   └── app.routes.ts        # Routing configuration
│   ├── environments/            # Environment configurations
│   ├── styles.css               # Global styles with Tailwind
│   └── index.html               # Main HTML file
├── docs/                        # Project documentation
├── .github/                     # GitHub workflows
├── angular.json                 # Angular workspace config
├── tailwind.config.js           # Tailwind CSS config
└── package.json                 # Dependencies and scripts
```

## 🧩 Shared Components Library

This project includes a **reusable components library** built with Tailwind CSS for consistent UI development.

### Available Components

- **StatusBadgeComponent** - Colored status badges (success, warning, error, info)
- **FeatureCardComponent** - Feature display cards with icons and descriptions  
- **StatusIndicatorComponent** - Operational status indicators with colored dots
- **ButtonComponent** - Buttons with multiple variants and sizes

### Usage Example
```typescript
import { ButtonComponent, StatusBadgeComponent } from './shared';

@Component({
  imports: [ButtonComponent, StatusBadgeComponent],
  template: `
    <app-button text="Get Started" variant="primary" (buttonClick)="handleClick()"></app-button>
    <app-status-badge text="Active" variant="success"></app-status-badge>
  `
})
```

📖 **[View Complete Component Documentation →](src/app/shared/README.md)**

## 📚 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - Development guidelines and workflow
- **[Coding Standards](docs/CODING_STANDARDS.md)** - Code style and best practices  
- **[Architecture](docs/ARCHITECTURE.md)** - System design and decisions
- **[CI/CD Pipeline](docs/CI-CD.md)** - Automated testing and deployment
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment procedures
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Component Library](src/app/shared/README.md)** - Reusable UI components

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Development workflow
- Code standards
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Wotusay/MCP-testing/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Wotusay/MCP-testing/discussions)
- **Documentation**: [Project Docs](docs/)
