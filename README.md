# Angular Team Project

This project is a team-based Angular application with Tailwind CSS, created for collaborative development. Generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## 📋 Project Setup Progress (Ticket #1)

### ✅ Completed Steps

#### 1. Node.js Environment Setup
- **✅ Installed Node.js 20.19.4** using NVM
- **✅ Set Node.js 20 as default version** with `nvm alias default 20`
- **✅ Verified versions:**
  - Node.js: v20.19.4
  - npm: 10.8.2

#### 2. Angular CLI Installation
- **✅ Installed Angular CLI globally** using Bun: `bun install -g @angular/cli@latest`
- **✅ Angular CLI Version:** 20.1.3

#### 3. Angular Project Creation
- **✅ Created new Angular project** with the following configuration:
  - Project name: `angular-team-project`
  - Routing: ✅ Enabled
  - Styling: CSS (for Tailwind compatibility)
  - Package Manager: npm
  - TypeScript Strict Mode: ✅ Enabled
  - Zoneless: ✅ Enabled (Developer Preview)
  - SSR: ❌ Disabled

#### 4. Tailwind CSS Setup
- **✅ Installed Tailwind CSS** and dependencies: `npm install -D tailwindcss postcss autoprefixer`
- **✅ Created Tailwind configuration** (`tailwind.config.js`)
- **✅ Updated global styles** (`src/styles.css`) with Tailwind directives
- **✅ Configured content paths** for Tailwind to scan TypeScript and HTML files

#### 5. Project Structure Setup
- **✅ Created organized folder structure:**
  ```
  src/app/
  ├── components/     # Reusable UI components
  ├── services/       # Application services
  ├── models/         # TypeScript interfaces and types
  ├── guards/         # Route guards
  ├── interceptors/   # HTTP interceptors
  └── pipes/          # Custom pipes
  ```

#### 6. Environment Configuration
- **✅ Created environment files:**
  - `src/environments/environment.ts` (development)
  - `src/environments/environment.prod.ts` (production)
- **✅ Configured environment variables:**
  - API URLs
  - App name and version
  - Production flags

#### 8. Shell Configuration & PATH Setup
- **✅ Added Bun to PATH permanently:** `echo 'export PATH="/Users/wout/.bun/bin:$PATH"' >> ~/.zshrc`
- **✅ Reloaded shell configuration:** `source ~/.zshrc`
- **⚠️ User assistance needed:** Had to manually add Bun to PATH for Angular CLI to work globally
- **✅ Verified Angular CLI works:** `ng version` now works without export commands

#### 9. Project Testing & Troubleshooting
- **🔧 Issue encountered:** Terminal working directory not properly set for npm commands
- **❌ Error details:** `npm error: Could not read package.json: ENOENT: no such file or directory, open '/Users/wout/Desktop/POC AI Projects/package.json'`
- **🔍 Root cause:** Terminal was looking for package.json in parent directory instead of project directory
- **⚠️ User assistance needed:** Multiple terminal sessions caused directory confusion  
- **🔧 Resolution needed:** Must ensure terminal is in `/Users/wout/Desktop/POC AI Projects/angular-team-project/` before running npm commands

#### 10. Development Server Startup & Tailwind CSS Issues
- **✅ Fixed directory issue:** Successfully navigated to correct project directory (`/Users/wout/Desktop/POC AI Projects/`)
- **✅ Dependencies installed:** Ran `npm install` to install missing Angular packages
- **❌ Tailwind CSS Error:** `Error: It looks like you're trying to use 'tailwindcss' directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package`
- **🔧 Root cause:** Tailwind CSS v4+ requires separate `@tailwindcss/postcss` package
- **✅ Solution applied:** Installed `npm install -D @tailwindcss/postcss`
- **✅ PostCSS configured:** Created `postcss.config.js` with proper Tailwind plugin setup
- **📝 Status:** PostCSS configuration completed, ready for development server

#### 11. ESLint & Prettier Setup (Code Quality & Formatting)
- **✅ ESLint installation:** Installed with Angular, TypeScript, and RxJS rules
- **✅ Prettier installation:** Configured with consistent code formatting
- **✅ VS Code integration:** Auto-fix on save enabled for both ESLint and Prettier
- **✅ Git hooks setup:** Husky + lint-staged for pre-commit code quality checks
- **✅ Strict rules configured:**
  - TypeScript strict mode with explicit types
  - Angular component/directive naming conventions
  - RxJS best practices and memory leak prevention
  - Accessibility linting for HTML templates
  - 120 character line length limit
- **✅ Scripts added to package.json:**
  - `npm run lint` - Check for linting errors
  - `npm run lint:fix` - Auto-fix linting issues
  - `npm run format` - Format code with Prettier
  - `npm run format:check` - Check code formatting
- **📝 Branch:** `feature/eslint-prettier-setup` with organized commits

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.4+ (managed with NVM)
- npm 10.8.2+
- Angular CLI 20.1.3+

### Setup Instructions for New Team Members

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
   ```

5. **Open your browser:**
   Navigate to `http://localhost:4200/`

## 🛠️ Development Commands

### Development server
To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Build
```bash
ng build
```

### Testing
```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e
```

### Linting & Formatting
```bash
# Check for ESLint errors (strict mode - no warnings allowed)
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check

# Run both linting and formatting (used in pre-commit)
npm run pre-commit
```

### Legacy Angular CLI
```bash
# Angular CLI linting (if configured)
ng lint
```

## 📁 Project Structure

```
angular-team-project/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # Application services
│   │   ├── models/              # TypeScript interfaces and types
│   │   ├── guards/              # Route guards for authentication/authorization
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── pipes/               # Custom pipes
│   │   ├── app.ts              # Main app component
│   │   ├── app.html            # App template with Tailwind CSS
│   │   ├── app.config.ts       # App configuration
│   │   └── app.routes.ts       # Routing configuration
│   ├── environments/
│   │   ├── environment.ts      # Development environment
│   │   └── environment.prod.ts # Production environment
│   ├── styles.css              # Global styles with Tailwind directives
│   └── index.html              # Main HTML file
├── tailwind.config.js          # Tailwind CSS configuration
├── angular.json                # Angular workspace configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Key features:

- **Utility-first CSS framework** for rapid UI development
- **Responsive design** utilities built-in
- **Customizable** through `tailwind.config.js`
- **Global styles** configured in `src/styles.css`

### Example Usage
```html
<div class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</div>
```

## 🔄 Git Workflow (To be implemented in Ticket #10)

- **Main branch:** `main` - Production-ready code
- **Feature branches:** `feature/ticket-name` - Individual features
- **Pull requests** required for all changes
- **Code reviews** mandatory before merging

## 📝 Next Steps

### Remaining Tickets:
- **Ticket #2:** Development Environment Configuration
- **Ticket #3:** CI/CD Pipeline Setup
- **Ticket #4:** UI Foundation & Design System
- **Ticket #5:** Core Services & State Management
- **Ticket #6:** Testing Framework Setup
- **Ticket #7:** Project Documentation
- **Ticket #8:** Security Implementation
- **Ticket #9:** Performance Optimization
- **Ticket #10:** Team Workflow & Code Review Process

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test your changes locally
4. Submit a pull request
5. Wait for code review approval

## 📞 Support

For questions or issues, please:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

## 🚀 Deployment

Deployment instructions will be added in future tickets as the CI/CD pipeline is implemented.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
