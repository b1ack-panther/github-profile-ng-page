# Vercel Deployment Guide

## Deploying with a New Project Name

If you get the error "Project already exists, please use a new name", you have several options:

### Option 1: Deploy with a Different Name

Use the `--name` flag to specify a new project name:

```bash
vercel deploy --prod --name github-profile-app-angular
```

Or deploy without linking to an existing project:

```bash
vercel --prod --name your-unique-project-name
```

### Option 2: Link to Existing Project

If you want to use the existing project, first link to it:

```bash
vercel link
```

Then follow the prompts to select your existing project, or:

```bash
vercel link --project=github-profile-ng-page
```

Then deploy:

```bash
vercel deploy --prod
```

### Option 3: Create New Project via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository or deploy manually
4. Set up environment variables (see below)
5. Deploy

## Setting Up Environment Variables

1. **In Vercel Dashboard**:

   - Go to your project → **Settings** → **Environment Variables**
   - Add:
     - **Name**: `NG_APP_GITHUB_TOKEN`
     - **Value**: Your GitHub Personal Access Token
     - **Environment**: Production (and Preview/Development if needed)

2. **The build script will automatically**:
   - Read `NG_APP_GITHUB_TOKEN` from Vercel's environment variables
   - Inject it into `src/environments/environment.prod.ts` during build

## Build and Deploy

```bash
# Install dependencies
npm install

# Build and deploy to production
npm run build:vercel && vercel deploy --prod

# Or if using a new project name:
npm run build:vercel && vercel deploy --prod --name your-new-project-name
```

## Troubleshooting

- **"Project already exists"**: Use `--name` flag or link to existing project with `vercel link`
- **"Environment variable not found"**: Make sure you set `NG_APP_GITHUB_TOKEN` in Vercel dashboard
- **Build fails**: Check that the token has correct scopes (`public_repo`, `read:user`)
