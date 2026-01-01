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

- **Node.js 18+** and **npm** (or yarn/pnpm)
- A modern web browser

### Installation

1. **Clone this repository:**
   ```bash
   git clone <your-repo-url>
   cd GH-Roulette-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Create a `.env.local` file for a GitHub token:**
   ```bash
   # Create the file
   echo "GITHUB_TOKEN=your_token_here" > .env.local
   ```
   
   Or manually create `.env.local` in the root directory with:
   ```
   GITHUB_TOKEN=your_token_here
   ```
   
   **Getting a GitHub Token:**
   - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "GitHub Roulette"
   - Select scope: `public_repo` (or just leave it with default public read access)
   - Click "Generate token"
   - Copy the token and paste it into `.env.local`
   
   **Note:** The token is optional but recommended. Without it, you're limited to 60 requests/hour. With it, you get 5,000 requests/hour.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

### The Randomness Problem

GitHub's API doesn't provide a "give me a random repository" endpoint. So how do we find random repos?

### Our Solution

1. **Random Query Generation**: We generate random search queries using short random strings (1-3 characters from `a-z0-9`)
   - Example queries: `"a"`, `"x7"`, `"m2k"`
   - These queries match repositories that contain these strings in their name, description, or README

2. **Candidate Pool**: We fetch up to 50 repositories from GitHub's search API using the random query

3. **Exclusion Filtering**: We filter out repositories you've recently seen (based on your "Seen History Window Size" setting)

4. **Random Sampling**: From the remaining candidates, we randomly select 5 repositories to display

5. **Optional Bias**: If you enable filters (genre, language, OS, min stars), the search query is modified to bias results toward your preferences, but randomness is still maintained within those constraints

### Why Results Might Repeat

- GitHub's search API returns results sorted by relevance/recency, not truly random
- If you've seen many repos recently, the exclusion filter might filter out most candidates
- The random seed might occasionally generate similar queries
- **Solution**: Adjust your "Seen History Window Size" in Settings to control how many recent repos are excluded

### Rate Limits Explained

GitHub enforces rate limits to prevent API abuse:

- **Unauthenticated (no token)**:
  - General REST API: 60 requests/hour
  - Search API: 10 requests/minute
  
- **Authenticated (with token)**:
  - General REST API: 5,000 requests/hour
  - Search API: 30 requests/minute

**What this means:**
- Each "Find 5 Random Repos" click = 1 API request
- Without a token: ~60 discoveries per hour max
- With a token: ~5,000 discoveries per hour max (practically unlimited for casual use)

The app shows your remaining requests and when the limit resets. The "Find" button is automatically disabled when you hit the limit.

## Usage Guide

### Discovering Repos

1. **On the main page**, click the **"Find 5 Random Repos"** button
2. Wait a few seconds while the app searches GitHub
3. **5 random repositories** will appear as cards
4. Each card shows:
   - Repository name and owner
   - Description
   - Programming language
   - Star count
   - Top 3 topics/tags
   - "Open on GitHub" button
   - Save button (☆)

### Saving Repos

- Click the **star icon (☆)** on any repo card to save it
- The icon changes to **★** when saved
- Click again to unsave
- View all saved repos on the **"Saved Repos"** page (accessible from the top navigation)

### Using Filters

Filters are **optional** and **off by default** for maximum randomness. To use them:

1. Click the **▶** button next to "Filters (Optional)" to expand
2. Choose any combination:
   - **Genre**: Predefined categories like "LLM/AI", "Web Dev", "Games"
   - **Language**: Filter by programming language (JavaScript, Python, etc.)
   - **OS/Platform**: Filter by operating system (Linux, Windows, macOS, etc.)
   - **Min Stars**: Set a minimum star count
3. Click **"Find 5 Random Repos"** - results will be biased toward your filters
4. Click **"Reset to Random"** to clear all filters

### Managing Genres

Genres are custom topic categories you can create:

1. Go to **Settings** (top navigation)
2. In the **Genres** section:
   - Click **"+ Add Genre"** to create a new one
   - Click **"Edit"** on any genre to modify it
   - Click **"Delete"** to remove a genre
3. Each genre has:
   - **Name**: Display name (e.g., "LLM/AI")
   - **Topics**: Comma-separated GitHub topics (e.g., "llm, ai, machine-learning")
4. Genres are saved automatically and persist across sessions

**Default Genres:**
- **LLM/AI**: llm, ai, machine-learning, deep-learning
- **Web Dev**: web, javascript, react, frontend
- **Games**: game, gamedev, unity, game-engine
- **CLI Tools**: cli, command-line, terminal

### Seen History & Deduplication

The app tracks which repos you've seen to avoid showing repeats:

1. Every time you click "Find 5 Random Repos", the displayed repos are marked as "seen"
2. These repos are automatically excluded from future searches
3. **Seen History Window Size** (in Settings) controls how many recent repos are excluded:
   - Default: 100 repos
   - Set to 0 to disable exclusion
   - Higher numbers = fewer repeats but potentially fewer results if you've seen many repos

### Settings

Access settings from the top navigation:

- **Seen History Window Size**: How many recently seen repos to exclude (default: 100)
- **GitHub Token**: Optional personal access token for higher rate limits
  - Can be set via `.env.local` (server-side) or in Settings UI (client-side, stored locally)
  - Token is stored in browser localStorage only - never sent to any server except GitHub

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
│   │   ├── FiltersPanel.tsx      # Filter controls
│   │   ├── RateLimitPanel.tsx   # Rate limit display
│   │   └── GenresEditor.tsx      # Genre management
│   └── lib/
│       ├── github/
│       │   ├── discover.ts       # GitHub API client
│       │   ├── queryBuilder.ts   # Search query builder
│       │   └── types.ts          # TypeScript types
│       └── storage/
│           └── localStore.ts     # LocalStorage utilities
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Technical Details

### Storage

All data is stored locally in your browser using `localStorage`:

- **Saved Repos** (`gh_roulette_saved`): Array of saved repository objects with metadata
- **Seen History** (`gh_roulette_seen`): Array of repository IDs with timestamps
- **Genres** (`gh_roulette_genres`): Array of custom genre definitions
- **Settings** (`gh_roulette_settings`): User preferences object

**Important:** Clearing your browser data will delete all saved repos, seen history, and custom genres.

### API Endpoints

**`GET /api/discover`**

Proxies requests to GitHub's Search API with error handling and rate limit tracking.

**Query Parameters:**
- `genre` (string, optional): Genre ID to filter by
- `language` (string, optional): Programming language filter
- `os` (string, optional): OS/platform filter
- `minStars` (number, optional): Minimum star count
- `genres` (JSON string, optional): Full genres array for server-side filtering
- `excludeIds` (JSON string, optional): Array of repository IDs to exclude

**Response:**
```typescript
{
  repos: GitHubRepo[],
  rateLimit: {
    remaining: number,
    limit: number,
    reset: number,      // Unix timestamp
    resetAt: Date        // Date object (serialized as string in JSON)
  },
  error?: string         // Present if request failed
}
```

### Error Handling

- **Rate Limit Errors (403/429)**: Shows friendly message with reset time, disables "Find" button
- **Network Errors**: Displays clear error message, app remains functional
- **Invalid Parameters**: Returns 400 Bad Request with descriptive error
- **GitHub API Errors**: Shows error status and message

### Security

- GitHub token is stored locally only (browser localStorage or `.env.local`)
- Token is never logged or exposed in client-side code
- All API requests go through Next.js API route (server-side proxy)
- No user data is sent to any server except GitHub's API

## Development

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint
```

### Development Tips

- The app uses **Next.js 14** with the App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **localStorage** for client-side persistence
- API routes run server-side, components run client-side (marked with `'use client'`)

### Environment Variables

Create `.env.local` (not committed to git):

```
GITHUB_TOKEN=ghp_your_token_here
```

## Troubleshooting

### "Rate limit exceeded" error

- **Solution 1**: Wait for the reset timer (shown in the Rate Limit panel)
- **Solution 2**: Add a GitHub token to increase limits (see Installation step 3)
- **Solution 3**: Reduce your "Seen History Window Size" to get more results per search

### No results appearing

- Check your internet connection
- Verify GitHub API is accessible (not blocked by firewall/proxy)
- Check browser console for errors
- Try reducing filters or seen history window size

### Saved repos disappeared

- This happens if you clear browser data/cookies
- Saved repos are stored in localStorage, not on a server
- There's no recovery - this is by design for the MVP

### Token not working

- Verify token is in `.env.local` (not `.env`)
- Restart the dev server after adding token
- Check token has `public_repo` scope (or at least public read access)
- Token format should be `ghp_...` (classic token) or `github_pat_...` (fine-grained)

### Results seem repetitive

- Increase "Seen History Window Size" in Settings
- Try different filters to get different result pools
- Clear seen history (if you want to see repos again)
- The randomness is approximate - some repetition is expected

## Limitations & Notes

- **Randomness is approximate**: Results may occasionally repeat, especially if you've seen many repos
- **Rate limits**: Enforced by GitHub, not the app
- **Local storage only**: All data is stored in your browser (cleared if you clear browser data)
- **No cloud sync**: By design for MVP - no account system
- **No quality ranking**: Results aren't sorted by stars/quality by default (that's a filter option)

## Future Enhancements

Potential additions (see PRD for full backlog):

- "Chaos dial" for obscurity vs popularity slider
- Export saved repos (JSON/CSV)
- Import/export genres
- Session streak counter ("you've explored 25 repos today")
- Notes/tags on saved repos
- "Open all 5 in tabs" button
- Desktop app wrapper (Tauri/Electron)
- Exclude topics list
- Better randomness algorithms

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

See LICENSE file for details.
