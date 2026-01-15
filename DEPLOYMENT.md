# Deployment Instructions

## 🚀 Push to GitHub

### Option 1: Using GitHub CLI (Recommended)

1. Authenticate with GitHub:
```bash
gh auth login
```

2. Create and push repository:
```bash
gh repo create rocketagents-landing --public --source=. --remote=origin --push
```

### Option 2: Manual Push

1. Create a new repository on GitHub (https://github.com/new):
   - Repository name: `rocketagents-landing`
   - Description: "Modern landing page for Rocketagents.ai"
   - Public repository
   - Don't initialize with README (we already have one)

2. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/rocketagents-landing.git
git branch -M main
git push -u origin main
```

## 🌐 Deploy to GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" in the left sidebar
4. Under "Source":
   - Branch: `main`
   - Folder: `/src`
5. Click "Save"
6. Your site will be live at: `https://YOUR_USERNAME.github.io/rocketagents-landing/`

## 🎯 Alternative Deployment Options

### Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Build settings:
   - Base directory: (leave empty)
   - Publish directory: `src`
5. Click "Deploy site"

### Vercel

1. Go to https://vercel.com/
2. Click "Import Project"
3. Import your GitHub repository
4. Project settings:
   - Root Directory: `src`
5. Click "Deploy"

### Cloudflare Pages

1. Go to https://pages.cloudflare.com/
2. Click "Create a project"
3. Connect your GitHub repository
4. Build settings:
   - Build output directory: `src`
5. Click "Save and Deploy"

## ✅ Testing Locally

Before deploying, test locally:

```bash
# Using Python
cd src
python3 -m http.server 8080

# Using Node.js
npx http-server src -p 8080 -o

# Using PHP
cd src
php -S localhost:8080
```

Then open: http://localhost:8080

## 📝 Post-Deployment Checklist

- [ ] Verify all links work
- [ ] Test on mobile devices
- [ ] Check all images load
- [ ] Test form submissions (if any)
- [ ] Verify meta tags for SEO
- [ ] Test loading speed
- [ ] Check browser compatibility

## 🔧 Troubleshooting

### GitHub Pages not loading styles

If styles don't load on GitHub Pages, check that paths are relative:
- ✅ `href="css/style.css"`
- ❌ `href="/css/style.css"`

### 404 errors

Make sure you selected the `/src` folder in GitHub Pages settings, not root.

## 🎨 Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In GitHub Pages settings, add your custom domain
3. In your domain registrar, add these DNS records:
   ```
   A Record: 185.199.108.153
   A Record: 185.199.109.153
   A Record: 185.199.110.153
   A Record: 185.199.111.153
   ```
4. Wait for DNS propagation (up to 48 hours)

---

Need help? Check the README.md or open an issue!
