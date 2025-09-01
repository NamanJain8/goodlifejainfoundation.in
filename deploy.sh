#!/bin/bash

# Build the React application
echo "🏗️  Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Deploy to Netlify production
    echo "🚀 Deploying to Netlify production..."
    netlify deploy --prod --dir=build
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment completed successfully!"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed! Deployment aborted."
    exit 1
fi
