# GitHub Profile Angular App

This is a complete Angular standalone application that replicates a GitHub profile page with real API integration and contribution graphs.

## Features

✅ **Standalone Angular Architecture** (Angular 18+)
✅ **GitHub API Integration** - User profile data
✅ **Contribution Graph** - Using Plotly.js for heatmap visualization
✅ **Responsive Design** - Mobile, tablet, and desktop support
✅ **Working Tabs** - Repositories, Projects, Packages tabs functional
✅ **Dark Theme** - Authentic GitHub dark mode design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v18 or higher)

## Installation

1. **Install Angular CLI globally** (if not already installed):
```bash
npm install -g @angular/cli
```

2. **Create a new Angular project**:
```bash
ng new github-profile-app --standalone --routing=false --style=css
cd github-profile-app
```

3. **Install Plotly.js**:
```bash
npm install plotly.js-dist-min
npm install --save-dev @types/plotly.js
```

4. **Replace the generated files** with the provided files:
   - `src/app/app.component.ts`
   - `src/app/app.component.html`
   - `src/app/app.component.css`
   - `src/main.ts`
   - `src/index.html`
   - `src/styles.css`
   - `angular.json`
   - `package.json`
   - `tsconfig.json`
   - `tsconfig.app.json`

## Configuration

### GitHub API Token

The app is configured with your provided GitHub token. To use your own token:

1. Generate a personal access token at: https://github.com/settings/tokens
2. Update the `GITHUB_TOKEN` in `app.component.ts`:
```typescript
private readonly GITHUB_TOKEN = 'your_token_here';
```

### API Endpoints

The app uses these GitHub API endpoints:
- **User Profile**: `https://api.github.com/user`
- **Contributions**: Generated as mock data (GitHub doesn't provide a direct API for the contribution graph)

## Running the Application

1. **Development server**:
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
│   │   ├── app.component.ts       # Main component with logic
│   │   ├── app.component.html     # Template
│   │   └── app.component.css      # Component styles
│   ├── index.html                  # HTML entry point
│   ├── main.ts                     # Bootstrap file
│   └── styles.css                  # Global styles
├── angular.json                    # Angular CLI configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── tsconfig.app.json              # App-specific TS config
```

## Features Implementation

### 1. User Profile API Integration ✅
- Fetches authenticated user data from GitHub API
- Displays avatar, name, bio, followers, following
- Shows location and website
- Fallback to mock data if API fails

### 2. Contribution Graph ✅
- Uses Plotly.js to create GitHub-style heatmap
- Shows 365 days of contribution data
- Color-coded by contribution level (0-4)
- Responsive and interactive
- Mock data generation (GitHub API doesn't provide direct contribution endpoint)

### 3. Responsive Design ✅
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Collapsible navigation on mobile
- Stacked layout on smaller screens

### 4. Working Tabs ✅
- Overview, Repositories, Projects, Packages, Stars
- Tab switching functionality
- Active state indication
- Empty states for non-overview tabs

### 5. UI Components ✅
- Stats card with GitHub metrics
- Pinned repositories grid
- Activity timeline
- Achievement badges
- Profile sidebar with follow button

## Customization

### Change Username
To fetch a different user's profile, modify the API call in `app.component.ts`:
```typescript
// Change from /user to /users/username
this.http.get<GitHubUser>(`${this.API_BASE}/users/shreeramk`, { headers: this.getHeaders() })
```

### Add More Repositories
Update the `pinnedRepos` array in `app.component.ts`:
```typescript
pinnedRepos = [
  {
    name: 'username/repo-name',
    description: 'Repository description',
    language: 'TypeScript',
    stars: 100,
    forks: 20,
    isPublic: true
  }
];
```

### Modify Contribution Colors
Adjust the colorscale in the `renderContributionGraph()` method:
```typescript
colorscale: [
  [0, '#161b22'],    // No contributions
  [0.25, '#0e4429'], // Low
  [0.5, '#006d32'],  // Medium
  [0.75, '#26a641'], // High
  [1, '#39d353']     // Very high
]
```

## API Rate Limits

GitHub API has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour

The app uses authenticated requests with your personal access token.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

1. **Contribution Data**: GitHub doesn't provide a public API for the contribution graph. The app generates mock data that resembles real contribution patterns.

2. **Private Repositories**: The API only shows public repository counts for other users. Use your own token to see private repos for your account.

3. **Real-time Updates**: Data is fetched on component initialization. Refresh the page to get updated data.

## Future Enhancements

- [ ] Add real repository list with search/filter
- [ ] Implement pagination for repositories
- [ ] Add project and package tabs with actual data
- [ ] Integrate real contribution data if available
- [ ] Add user search functionality
- [ ] Implement dark/light theme toggle
- [ ] Add animations and transitions
- [ ] Cache API responses

## Troubleshooting

### Issue: API returns 401 Unauthorized
**Solution**: Check that your GitHub token is valid and has the correct permissions.

### Issue: CORS errors
**Solution**: GitHub API supports CORS. If you encounter issues, ensure you're using the correct headers.

### Issue: Contribution graph not rendering
**Solution**: Check browser console for Plotly.js errors. Ensure the library is properly installed.

### Issue: Styles not loading
**Solution**: Verify that `styles.css` is included in `angular.json` under the `styles` array.

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is created for educational purposes as part of the UptimeAI assignment.

## Credits

- **Design**: Based on GitHub's profile page
- **Framework**: Angular 18+ (Standalone)
- **Charting**: Plotly.js
- **API**: GitHub REST API v3

---

**Note**: This is an assignment project for UptimeAI and demonstrates Angular development skills, API integration, responsive design, and data visualization capabilities.