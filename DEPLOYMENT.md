# Deployment Guide for Kontent.ai Custom App

This guide provides multiple deployment options to ensure your custom app can be embedded in Kontent.ai without iframe issues.

## 🚨 The Problem

Vercel automatically adds `X-Frame-Options: deny` which prevents iframe embedding. This is a common issue with Vercel deployments.

## ✅ Solution Options

### Option 1: Netlify (Recommended)

Netlify provides better control over headers and doesn't automatically add X-Frame-Options.

1. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build the app
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod --dir=dist
   ```

2. **Or connect your GitHub repository:**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy

3. **The `netlify.toml` file will automatically configure the correct headers.**

### Option 2: Express Server (Full Control)

For complete control over headers, use the included Express server.

1. **Install dependencies:**
   ```bash
   npm install express
   ```

2. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

3. **Deploy to any Node.js hosting:**
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

### Option 3: Static Hosting

Use any static hosting service that allows custom headers.

**Examples:**
- GitHub Pages (with custom headers via proxy)
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

### Option 4: Vercel with Custom Domain

Sometimes using a custom domain with Vercel can help:

1. **Add a custom domain to your Vercel project**
2. **Configure headers in your domain provider**
3. **Use Cloudflare as a proxy to modify headers**

## 🔧 Testing Iframe Embedding

### Local Testing
```bash
npm run dev
```
Then open `test-iframe.html` in your browser.

### Production Testing
1. Deploy using one of the options above
2. Test the URL in an iframe:
   ```html
   <iframe src="YOUR_DEPLOYMENT_URL" width="100%" height="600"></iframe>
   ```

## 🎯 Expected Results

After successful deployment, you should see:
- ✅ No "X-Frame-Options: deny" errors
- ✅ App loads properly in Kontent.ai iframe
- ✅ API calls work correctly
- ✅ Proper CORS headers

## 🚀 Adding to Kontent.ai

1. Go to your Kontent.ai project
2. Navigate to Environment settings → Custom apps
3. Add your deployment URL
4. Test the app within Kontent.ai

## 🔍 Troubleshooting

### Still getting X-Frame-Options errors?
- Try Netlify instead of Vercel
- Use the Express server option
- Check if your hosting provider allows custom headers

### App not loading in Kontent.ai?
- Verify HTTPS is enabled
- Check Content-Security-Policy headers
- Ensure CORS is configured correctly

### API calls failing?
- Verify Access-Control-Allow-Origin is set to `https://app.kontent.ai`
- Check that all required CORS headers are present 