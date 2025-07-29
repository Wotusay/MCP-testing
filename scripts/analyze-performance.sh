#!/bin/bash

echo "🚀 Starting performance analysis..."

# Create reports directory if it doesn't exist
mkdir -p reports

# Build the application with stats
echo "📦 Building application with bundle analysis..."
npm run build:prod -- --stats-json

# Check if stats.json was created
if [ -f "dist/angular-team-project/stats.json" ]; then
    echo "📊 Analyzing bundle..."
    npx webpack-bundle-analyzer dist/angular-team-project/stats.json --mode static --report reports/bundle-analysis.html --no-open
    echo "Bundle analysis saved to reports/bundle-analysis.html"
else
    echo "❌ Stats file not found. Bundle analysis skipped."
fi

# Get bundle sizes
echo "📈 Bundle Size Analysis:"
echo "========================"
if [ -d "dist/angular-team-project" ]; then
    find dist/angular-team-project -name "*.js" -exec echo "JS: {} $(stat --format=%s {} | numfmt --to=iec-i --suffix=B)" \;
    find dist/angular-team-project -name "*.css" -exec echo "CSS: {} $(stat --format=%s {} | numfmt --to=iec-i --suffix=B)" \;
    
    total_size=$(find dist/angular-team-project -type f \( -name "*.js" -o -name "*.css" \) -exec stat --format=%s {} \; | awk '{sum+=$1} END {print sum}')
    echo "Total bundle size: $(echo $total_size | numfmt --to=iec-i --suffix=B)"
else
    echo "❌ Build directory not found."
fi

echo "✅ Performance analysis complete!"
echo "🔍 Check reports/ directory for detailed analysis"