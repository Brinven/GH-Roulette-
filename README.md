# GitHub Roulette

Discover random GitHub repositories with a single click. Perfect for when you're bored and curious, but GitHub search feels too intentional.

## Features

- **Find 5 Random Repos**: One button to discover 5 random public repositories
- **Topic-Based Genre Filtering**: Optional filters to bias results toward specific topics (LLM, Web Dev, Games, etc.)
- **Save & Track History**: Save repos you like and track what you've seen to avoid repeats
- **Rate Limit Monitoring**: Real-time display of remaining API requests and reset timer
- **Local Storage**: Everything stored locally - no account required

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd GH-Roulette-
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env.local` file for a GitHub token:
```bash
GITHUB_TOKEN=your_token_here
```

Get a token at [github.com/settings/tokens](https://github.com/settings/tokens) (optional - increases rate limit from 60/hour to 5000/hour)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### Randomness Approach

GitHub doesn't provide a true "random repo" endpoint. This app approximates randomness by:

1. Generating random seed queries (random short strings)
2. Fetching a candidate pool from GitHub Search API
3. Sampling 5 repos after excluding recently seen ones
4. Using optional filters to bias results (off by default for true randomness)

### Rate Limits

- **Unauthenticated**: 60 requests/hour (general REST API)
- **Authenticated**: 5,000 requests/hour (with personal access token)
- **Search API**: 10 requests/minute (unauthenticated) or 30 requests/minute (authenticated)

The app displays your current rate limit status and automatically disables the "Find" button when limits are exhausted.

## Project Structure

```
github-roulette/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main discover page
│   │   ├── saved/page.tsx        # Saved repos list
│   │   ├── settings/page.tsx     # Settings & genres
│   │   └── api/
│   │       └── discover/route.ts # GitHub API proxy
│   ├── components/
│   │   ├── RepoCard.tsx          # Repository card component
│   │   ├── FiltersPanel.tsx     # Filter controls
│   │   ├── RateLimitPanel.tsx    # Rate limit display
│   │   └── GenresEditor.tsx      # Genre management
│   └── lib/
│       ├── github/
│       │   ├── discover.ts       # GitHub API client
│       │   ├── queryBuilder.ts   # Search query builder
│       │   └── types.ts          # TypeScript types
│       └── storage/
│           └── localStore.ts     # LocalStorage utilities
├── package.json
└── README.md
```

## Usage

### Discovering Repos

1. Click "Find 5 Random Repos" on the main page
2. Results appear in cards with repo info
3. Click "Open on GitHub" to visit the repo
4. Click the star icon (☆) to save a repo

### Using Filters

- **Genre**: Select a predefined genre to bias results (e.g., "LLM/AI", "Web Dev")
- **Language**: Filter by programming language
- **OS/Platform**: Filter by operating system topics
- **Min Stars**: Set minimum star count

Filters are optional and off by default for maximum randomness.

### Managing Genres

1. Go to Settings
2. Add, edit, or delete genres
3. Each genre maps to one or more GitHub topics
4. Genres persist across sessions

### Saved Repos

- View all saved repos on the "Saved Repos" page
- Remove individual repos or clear all
- Saved repos persist in browser local storage

## Technical Details

### Storage

All data is stored locally in the browser:
- **Saved Repos**: List of saved repository IDs and metadata
- **Seen History**: Repository IDs with timestamps
- **Genres**: Custom genre definitions
- **Settings**: User preferences (seen window size, token)

### API Endpoints

- `GET /api/discover`: Proxies requests to GitHub Search API
  - Query params: `genre`, `language`, `os`, `minStars`, `genres`, `excludeIds`
  - Returns: `{ repos: GitHubRepo[], rateLimit: RateLimitInfo, error?: string }`

### Error Handling

- Rate limit errors (403/429) show friendly messages with reset time
- Network errors are displayed clearly
- App continues to function even after errors

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Limitations & Notes

- Randomness is approximate - results may occasionally repeat
- Rate limits are enforced by GitHub
- All data is stored locally (cleared if you clear browser data)
- No cloud sync or account system (by design for MVP)

## Future Enhancements

See the PRD for the full backlog. Potential additions:
- "Chaos dial" for obscurity vs popularity
- Export saved repos (JSON/CSV)
- Session streak counter
- Desktop app wrapper (Tauri)

## License

See LICENSE file for details.
