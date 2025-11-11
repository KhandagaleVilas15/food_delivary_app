# Deployment Guide

## For Render.com

1. **Using render.yaml (recommended)**:
   - The `render.yaml` file is already configured
   - Build Command: `npm install && npm run build`
   - Publish Directory: `./dist`

2. **Manual Configuration**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment: `static`

## For Netlify

1. **Using netlify.toml (already configured)**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Manual Configuration**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## For Vercel

1. **Using vercel.json (already configured)**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

## For Other Platforms

**Build Command**: `npm install && npm run build`
**Publish/Output Directory**: `dist`
**Node Version**: 18 or higher

## Troubleshooting

If you get "Publish directory dist does not exist":

1. Make sure the build command runs BEFORE looking for the dist folder
2. Use the clean build: `npm run build:clean`
3. Check that the platform is configured to run the build command first

## Environment Variables

Make sure to set these in your deployment platform:

```
VITE_BACKEND_URL=https://your-backend-url.com
```

## Build Verification

To test locally:
```bash
npm run build:clean
ls -la dist/
```

The dist folder should contain:
- index.html
- assets/ folder with CSS, JS, and image files
- vite.svg