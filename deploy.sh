#!/bin/bash

# Vite-optimized deployment script for Good Life Jain Foundation
# Enhanced with better performance monitoring and error handling

set -e  # Exit on any error

echo "🚀 Good Life Jain Foundation - Vite Deployment Script"
echo "=================================================="

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Record start time for performance monitoring
start_time=$(date +%s)

# Build the application with Vite
echo "🏗️  Building application with Vite (optimized for performance)..."
npm run build

# Calculate build time
end_time=$(date +%s)
build_time=$((end_time - start_time))

echo "✅ Build completed successfully in ${build_time} seconds!"

# Display build stats
if [ -d "build" ]; then
    echo "📊 Build Statistics:"
    echo "   • Total files: $(find build -type f | wc -l)"
    echo "   • Total size: $(du -sh build | cut -f1)"
    echo "   • JS chunks: $(find build/assets -name "*.js" | wc -l)"
    echo "   • CSS files: $(find build/assets -name "*.css" | wc -l)"
fi

# Verify critical files exist
echo "🔍 Verifying build integrity..."
if [ ! -f "build/index.html" ]; then
    echo "❌ Critical file missing: index.html"
    exit 1
fi

if [ ! -d "build/assets" ]; then
    echo "❌ Assets directory missing"
    exit 1
fi

echo "✅ Build integrity verified!"

# Deploy to Netlify production
echo "🚀 Deploying to Netlify production..."
deployment_start=$(date +%s)

if command -v netlify >/dev/null 2>&1; then
    netlify deploy --prod --dir=build
    
    deployment_end=$(date +%s)
    deployment_time=$((deployment_end - deployment_start))
    total_time=$((deployment_end - start_time))
    
    echo "✅ Deployment completed successfully!"
    echo "⏱️  Performance Summary:"
    echo "   • Build time: ${build_time}s"
    echo "   • Deployment time: ${deployment_time}s"
    echo "   • Total time: ${total_time}s"
    echo "🎉 Good Life Jain Foundation website is now live!"
else
    echo "❌ Netlify CLI not found. Please install it with: npm install -g netlify-cli"
    exit 1
fi
