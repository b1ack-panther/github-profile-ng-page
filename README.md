# GitHub Profile Angular App

A complete Angular standalone application that replicates a GitHub profile page with real API integration and contribution graphs.

## Features

✅ **Standalone Angular Architecture** (Angular 18+)  
✅ **GitHub API Integration** - Real user profile data  
✅ **Contribution Graph** - Interactive contribution heatmap using Plotly.js  
✅ **Activity Chart** - Radar chart showing contribution activity  
✅ **Responsive Design** - Mobile, tablet, and desktop support  
✅ **Dark Theme** - Authentic GitHub dark mode design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v18 or higher)
- GitHub Personal Access Token

## Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd github-profile-app
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up GitHub Personal Access Token**:

   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token" (classic)
   - Give it a descriptive name (e.g., "GitHub Profile App")
   - Select the following scopes:
     - `public_repo` - Access public repositories
     - `read:user` - Read user profile data
   - Click "Generate token"
   - **Copy the token immediately** (you won't be able to see it again)

4. **Add your token to environment files**:

   - Open `src/environments/environment.ts`
   - Replace the empty string in `githubToken` with your token:

   ```typescript
   export const environment = {
     production: false,
     githubToken: 'your_token_here',
   };
   ```

   - Do the same for `src/environments/environment.prod.ts` (if you plan to build for production)

5. **Security Note** ⚠️:
   - **Never commit your token to version control**
   - Add `src/environments/environment*.ts` to `.gitignore` if you want to keep tokens private
   - Or use environment variables in your deployment platform

## Running the Application

1. **Start the development server**:

```bash
ng serve
```

2. **Open your browser** and navigate to:

```
http://localhost:4200
```

3. **Build for production**:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
github-profile-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── contribution-graph-component/
│   │   │   │   ├── contribution-graph.component.ts
│   │   │   │   ├── contribution-graph.component.html
│   │   │   │   └── contribution-graph.component.css
│   │   │   └── activity-chart-component/
│   │   │       ├── activity-chart.component.ts
│   │   │       ├── activity-chart.component.html
│   │   │       └── activity-chart.component.css
│   │   ├── app.ts                    # Main component
│   │   ├── app.html                  # Main template
│   │   ├── app.css                   # Component styles
│   │   ├── github.service.ts         # GitHub API service
│   │   └── mockData.ts              # Mock data
│   ├── environments/
│   │   ├── environment.ts           # Development environment
│   │   └── environment.prod.ts      # Production environment
│   ├── index.html                    # HTML entry point
│   ├── main.ts                       # Bootstrap file
│   └── styles.css                    # Global styles
├── angular.json                      # Angular CLI configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Configuration

### GitHub Personal Access Token

The application requires a GitHub Personal Access Token to access the GitHub API. The token is stored in environment files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

**Token Requirements**:

- Must have `public_repo` scope (to read public repositories)
- Must have `read:user` scope (to read user profile data)

### Environment Variables

The app uses Angular's environment system. To add your token:

1. Open `src/environments/environment.ts`
2. Set the `githubToken` property:

```typescript
export const environment = {
  production: false,
  githubToken: 'your_github_personal_access_token_here',
};
```

3. For production builds, update `src/environments/environment.prod.ts` similarly

## API Endpoints

The app uses these GitHub API endpoints:

- **User Profile**: `GET /user` (authenticated)
- **User Repositories**: `GET /users/{username}/repos`
- **Contributions**: GraphQL API for contribution data

## Features Implementation

### 1. User Profile API Integration ✅

- Fetches authenticated user data from GitHub API
- Displays avatar, name, bio, followers, following
- Shows location and website if available

### 2. Contribution Graph ✅

- Uses Plotly.js to create GitHub-style heatmap
- Shows contribution data for the selected year
- Color-coded by contribution level
- Interactive with year selector
- Responsive design

### 3. Activity Chart ✅

- Radar/polar chart showing activity breakdown
- Displays commits, code reviews, issues, pull requests
- Visual activity overview

### 4. Responsive Design ✅

- Mobile-first approach
- Breakpoints: 480px, 720px
- Collapsible navigation on mobile
- Stacked layout on smaller screens

### 5. Repository Display ✅

- Shows pinned repositories
- Displays repository language, stars, forks
- Shows warning message if no token is configured

## Troubleshooting

### Issue: "GitHub Personal Access Token Required" message appears

**Solution**:

1. Make sure you've added your token to `src/environments/environment.ts`
2. Verify the token is not an empty string
3. Restart the development server after adding the token
4. Check that the token has the required scopes (`public_repo`, `read:user`)

### Issue: API returns 401 Unauthorized

**Solution**:

- Check that your GitHub token is valid
- Verify the token hasn't expired
- Ensure the token has the correct permissions
- Make sure you're using the token string correctly (no extra spaces or quotes)

### Issue: No repositories showing

**Solution**:

- Verify the token has `public_repo` scope
- Check browser console for API errors
- Ensure the user has public repositories
- Make sure the token is correctly set in the environment file

### Issue: CORS errors

**Solution**: GitHub API supports CORS. If you encounter issues:

- Ensure you're using authenticated requests (with token)
- Check that the token is properly formatted
- Verify you're not making requests from an unsupported origin

### Issue: Contribution graph not rendering

**Solution**:

- Check browser console for Plotly.js errors
- Ensure Plotly.js is properly installed (`npm install plotly.js-dist-min`)
- Verify the contribution data is being fetched correctly
- Check that the DOM element exists when Plotly tries to render

### Issue: Styles not loading

**Solution**:

- Verify that `styles.css` is included in `angular.json` under the `styles` array
- Check that component styles are properly imported
- Ensure no CSS conflicts with global styles

## Vercel Deployment

### Setting up Environment Variables in Vercel

1. **Add Environment Variable in Vercel**:

   - Go to your Vercel project settings
   - Navigate to **Settings → Environment Variables**
   - Add a new environment variable:
     - **Name**: `GITHUB_TOKEN`
     - **Value**: Your GitHub Personal Access Token
     - **Environment**: Production, Preview, and Development (or just Production if preferred)

2. **The build process will automatically**:

   - Read `GITHUB_TOKEN` from Vercel's environment variables
   - Inject it into `src/environments/environment.prod.ts` during build
   - Use it in the Angular application

3. **Deploy**:
   ```bash
   vercel deploy --prod
   ```
   Or push to your connected Git repository for automatic deployments.

### How It Works

The `scripts/set-env.js` script runs before the build:

- Reads `GITHUB_TOKEN` from Vercel's environment variables (`process.env.GITHUB_TOKEN`)
- Writes it to `src/environments/environment.prod.ts`
- Angular build process uses this file for production builds

**Note**: The script checks for multiple environment variable names:

- `GITHUB_TOKEN` (recommended)
- `githubToken`
- `NG_APP_GITHUB_TOKEN`
- `VERCEL_GITHUB_TOKEN`

## Security Best Practices

1. **Never commit tokens to version control**

   - Add `src/environments/environment*.ts` to `.gitignore` if tokens are included
   - Use environment variables in deployment platforms (like Vercel)
   - Create `.env.example` files with placeholder values

2. **Token Management**

   - Use fine-grained tokens with minimal required scopes
   - Rotate tokens periodically
   - Revoke unused tokens immediately

3. **Production Deployments**
   - Use secure environment variable management (Vercel, etc.)
   - Never expose tokens in client-side code if possible
   - Consider using a backend proxy for API calls in production
   - Always use environment variables instead of hardcoding tokens

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

1. **Client-side Token Exposure**: The token is included in the client-side bundle. For production, consider using a backend API proxy.

2. **API Rate Limits**:

   - Authenticated requests: 5,000 per hour
   - Unauthenticated requests: 60 per hour
   - The app uses authenticated requests with your personal access token

3. **Real-time Updates**: Data is fetched on component initialization. Refresh the page to get updated data.

## Future Enhancements

- [ ] Add repository search and filtering
- [ ] Implement pagination for repositories
- [ ] Add project and package tabs with actual data
- [ ] Add user search functionality
- [ ] Implement dark/light theme toggle
- [ ] Add animations and transitions
- [ ] Cache API responses
- [ ] Add error handling and retry logic
- [ ] Implement backend API proxy for token security

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is created for educational purposes.

## Credits

- **Design**: Based on GitHub's profile page
- **Framework**: Angular 18+ (Standalone)
- **Charting**: Plotly.js
- **API**: GitHub REST API and GraphQL API

---

**Note**: Make sure to add your GitHub Personal Access Token before running the application. The app will display a warning message if no token is configured.
