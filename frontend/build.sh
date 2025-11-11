#!/bin/bash
# Build script for deployment

echo "Starting build process..."

# Remove existing dist folder if it exists
if [ -d "dist" ]; then
    echo "Removing existing dist folder..."
    rm -rf dist
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Verify dist folder exists
if [ -d "dist" ]; then
    echo "✅ Build successful! Dist folder created."
    ls -la dist/
else
    echo "❌ Build failed! Dist folder not found."
    exit 1
fi

echo "Build process completed successfully!"