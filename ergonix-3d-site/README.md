# Ergonix 3D Website

Static Next.js portfolio/company website for Ergonix.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
```

The static site is generated in `out/`.

## Git workflow

```bash
git pull
git checkout -b your-feature-name
# make changes
git add .
git commit -m "Describe your change"
git push -u origin your-feature-name
```

Then open a Pull Request into `main` on GitHub.

## GitHub Pages

This repository includes `.github/workflows/deploy-pages.yml`.

In GitHub, go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.
After that, every push to `main` builds and deploys the site automatically.
