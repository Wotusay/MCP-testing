import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

interface AngularImprovement {
  title: string;
  description: string;
  benefits: string[];
  oldWay?: string;
  newWay?: string;
  codeExample?: {
    old: string;
    new: string;
  };
  performanceGain?: string;
  category: 'architecture' | 'performance' | 'developer-experience' | 'build';
}

@Component({
  selector: 'app-angular-improvements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, NgClass],
  template: `
    <section
      class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 rounded-xl p-8 mb-8 border border-blue-200 dark:border-blue-700"
    >
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🚀 Angular 20: Revolutionary Improvements
          </h2>
          <p class="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            Discover the game-changing features that make Angular 20 the most
            performant and developer-friendly version yet. Our implementation
            leverages cutting-edge improvements for superior user experience.
          </p>
        </div>

        <!-- Key Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700"
          >
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              40%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Faster Change Detection
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700"
          >
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              60%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Smaller Bundle Size
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700"
          >
            <div
              class="text-2xl font-bold text-purple-600 dark:text-purple-400"
            >
              50%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Faster Build Times
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700"
          >
            <div
              class="text-2xl font-bold text-orange-600 dark:text-orange-400"
            >
              Zero
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Zone.js Overhead
            </div>
          </div>
        </div>

        <!-- Improvements Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            *ngFor="let improvement of improvements"
            class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <!-- Category Badge -->
            <div class="flex items-center justify-between mb-4">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {{ improvement.title }}
              </h3>
              <span
                class="px-3 py-1 text-xs rounded-full"
                [ngClass]="getCategoryClass(improvement.category)"
              >
                {{ getCategoryLabel(improvement.category) }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              {{ improvement.description }}
            </p>

            <!-- Performance Gain -->
            <div
              *ngIf="improvement.performanceGain"
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4"
            >
              <div class="flex items-center">
                <span class="text-green-600 dark:text-green-400 font-medium">
                  ⚡ Performance Gain:
                </span>
                <span class="text-green-700 dark:text-green-300 ml-2">
                  {{ improvement.performanceGain }}
                </span>
              </div>
            </div>

            <!-- Code Comparison -->
            <div *ngIf="improvement.codeExample" class="mb-4">
              <div class="space-y-3">
                <!-- Old Way -->
                <div>
                  <div
                    class="text-sm font-medium text-red-600 dark:text-red-400 mb-2"
                  >
                    ❌ Old Way (Angular 17-):
                  </div>
                  <pre
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-3 text-sm overflow-x-auto"
                  ><code class="text-red-800 dark:text-red-200">{{ improvement.codeExample.old }}</code></pre>
                </div>

                <!-- New Way -->
                <div>
                  <div
                    class="text-sm font-medium text-green-600 dark:text-green-400 mb-2"
                  >
                    ✅ New Way (Angular 20):
                  </div>
                  <pre
                    class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-3 text-sm overflow-x-auto"
                  ><code class="text-green-800 dark:text-green-200">{{ improvement.codeExample.new }}</code></pre>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div class="mb-4">
              <h4
                class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Key Benefits:
              </h4>
              <ul class="space-y-1">
                <li
                  *ngFor="let benefit of improvement.benefits"
                  class="flex items-start text-sm text-gray-700 dark:text-gray-300"
                >
                  <span class="text-green-500 mr-2">✓</span>
                  {{ benefit }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 mt-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎯 Why These Improvements Matter
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4
                class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2"
              >
                For Users
              </h4>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Faster page loads and interactions</li>
                <li>• Smoother animations and transitions</li>
                <li>• Better mobile performance</li>
                <li>• Reduced battery consumption</li>
              </ul>
            </div>
            <div>
              <h4
                class="text-lg font-semibold text-green-600 dark:text-green-400 mb-2"
              >
                For Developers
              </h4>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Simpler, more intuitive APIs</li>
                <li>• Faster development builds</li>
                <li>• Better debugging experience</li>
                <li>• Reduced boilerplate code</li>
              </ul>
            </div>
            <div>
              <h4
                class="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2"
              >
                For Business
              </h4>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Lower hosting costs</li>
                <li>• Improved SEO performance</li>
                <li>• Higher user engagement</li>
                <li>• Faster time-to-market</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AngularImprovementsComponent {
  protected readonly improvements: AngularImprovement[] = [
    {
      title: 'Zoneless Change Detection',
      description:
        'Angular 20 introduces zoneless change detection, eliminating Zone.js overhead and providing more predictable performance.',
      category: 'performance',
      performanceGain: '40% faster change detection, 15% smaller bundle size',
      benefits: [
        'No Zone.js patching overhead',
        'More predictable performance',
        'Better debugging experience',
        'Improved memory usage',
        'Faster application startup',
      ],
      codeExample: {
        old: `// Angular 17-: Zone.js required
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));`,
        new: `// Angular 20: Zoneless with provideZonelessChangeDetection
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    // Other providers...
  ]
});`,
      },
    },
    {
      title: 'Signals-Based Reactivity',
      description:
        'Revolutionary reactive programming model using signals that eliminates unnecessary change detection cycles.',
      category: 'architecture',
      performanceGain: '60% fewer change detection cycles',
      benefits: [
        'Fine-grained reactivity',
        'Automatic dependency tracking',
        'Simplified state management',
        'Better performance optimization',
        'Easier testing and debugging',
      ],
      codeExample: {
        old: `// Angular 17-: Observable patterns
@Component({...})
export class UserComponent {
  users$ = this.userService.getUsers();
  loading$ = this.userService.loading$;
  
  constructor(private userService: UserService) {}
}`,
        new: `// Angular 20: Signals
@Component({...})
export class UserComponent {
  protected readonly users = this.userService.users;
  protected readonly loading = this.userService.loading;
  
  private readonly userService = inject(UserService);
}`,
      },
    },
    {
      title: 'Modern Dependency Injection',
      description:
        'New inject() function provides cleaner, more functional dependency injection without constructor boilerplate.',
      category: 'developer-experience',
      performanceGain: '30% less boilerplate code',
      benefits: [
        'Functional injection patterns',
        'Better tree-shaking',
        'Cleaner component code',
        'Improved type inference',
        'Easier testing setup',
      ],
      codeExample: {
        old: `// Angular 17-: Constructor injection
@Component({...})
export class MyComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}
}`,
        new: `// Angular 20: inject() function
@Component({...})
export class MyComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
}`,
      },
    },
    {
      title: 'Standalone Components Architecture',
      description:
        'Components can be truly standalone without NgModules, leading to better tree-shaking and smaller bundles.',
      category: 'architecture',
      performanceGain: '25% smaller bundle size',
      benefits: [
        'No NgModule complexity',
        'Better tree-shaking',
        'Simplified imports',
        'Easier component testing',
        'More modular architecture',
      ],
      codeExample: {
        old: `// Angular 17-: NgModule required
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule, RouterModule],
  providers: [MyService]
})
export class MyModule {}`,
        new: `// Angular 20: Standalone component
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [MyService],
  template: '...'
})
export class MyComponent {}`,
      },
    },
    {
      title: 'New Build System',
      description:
        'Angular 20 features a completely rewritten build system powered by esbuild and Vite for lightning-fast builds.',
      category: 'build',
      performanceGain: '50% faster builds, 70% faster HMR',
      benefits: [
        'esbuild-powered compilation',
        'Vite-based development server',
        'Faster hot module replacement',
        'Better source maps',
        'Improved error reporting',
      ],
      codeExample: {
        old: `// Angular 17-: Webpack-based
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "outputPath": "dist/app",
    "index": "src/index.html",
    "main": "src/main.ts"
  }
}`,
        new: `// Angular 20: esbuild + Vite
"build": {
  "builder": "@angular/build:application",
  "options": {
    "browser": "src/main.ts",
    "tsConfig": "tsconfig.app.json"
  }
}`,
      },
    },
    {
      title: 'Enhanced Performance Monitoring',
      description:
        'Built-in performance monitoring and Core Web Vitals tracking for better user experience insights.',
      category: 'performance',
      performanceGain: 'Real-time performance insights',
      benefits: [
        'Core Web Vitals tracking',
        'Real-time performance metrics',
        'Automatic optimization hints',
        'Better user experience insights',
        'Performance budget enforcement',
      ],
      codeExample: {
        old: `// Angular 17-: Manual performance tracking
ngAfterViewInit() {
  const end = performance.now();
  console.log('Load time:', end - this.start);
}`,
        new: `// Angular 20: Built-in monitoring
@Component({...})
export class MyComponent {
  private readonly perf = inject(PerformanceMonitoringService);
  
  ngOnInit() {
    this.perf.measureComponentLoad();
  }
}`,
      },
    },
  ];

  protected getCategoryClass(category: string): string {
    const classes = {
      architecture:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      performance:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'developer-experience':
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      build:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return classes[category as keyof typeof classes] || '';
  }

  protected getCategoryLabel(category: string): string {
    const labels = {
      architecture: 'Architecture',
      performance: 'Performance',
      'developer-experience': 'Developer Experience',
      build: 'Build System',
    };
    return labels[category as keyof typeof labels] || category;
  }
}
