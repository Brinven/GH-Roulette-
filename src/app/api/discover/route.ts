import { NextRequest, NextResponse } from 'next/server';
import { discoverRepos, DiscoverOptions } from '@/lib/github/discover';
import { Genre } from '@/lib/github/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    genre: searchParams.get('genre') || undefined,
    language: searchParams.get('language') || undefined,
    os: searchParams.get('os') || undefined,
    minStars: searchParams.get('minStars') ? parseInt(searchParams.get('minStars')!, 10) : undefined,
  };

  // Parse genres with error handling
  let genres: Genre[] | undefined = undefined;
  const genresParam = searchParams.get('genres');
  if (genresParam) {
    try {
      genres = JSON.parse(genresParam);
    } catch (error) {
      return NextResponse.json(
        { repos: [], rateLimit: null, error: 'Invalid genres parameter: malformed JSON' },
        { status: 400 }
      );
    }
  }

  // Parse excludeIds with error handling
  let excludeIds: number[] = [];
  const excludeIdsParam = searchParams.get('excludeIds');
  if (excludeIdsParam) {
    try {
      excludeIds = JSON.parse(excludeIdsParam);
      // Validate it's an array of numbers
      if (!Array.isArray(excludeIds) || !excludeIds.every(id => typeof id === 'number')) {
        throw new Error('excludeIds must be an array of numbers');
      }
    } catch (error) {
      return NextResponse.json(
        { repos: [], rateLimit: null, error: 'Invalid excludeIds parameter: must be a JSON array of numbers' },
        { status: 400 }
      );
    }
  }
  const candidatePoolSize = searchParams.get('candidatePoolSize') ? parseInt(searchParams.get('candidatePoolSize')!, 10) : 50;
  const resultCount = searchParams.get('resultCount') ? parseInt(searchParams.get('resultCount')!, 10) : 5;

  // Support token from environment variable (server-side) or from client header
  const clientToken = request.headers.get('x-github-token');
  const token = clientToken || process.env.GITHUB_TOKEN || undefined;

  const options: DiscoverOptions = {
    filters: Object.keys(filters).some(k => filters[k as keyof typeof filters]) ? filters : undefined,
    genres,
    excludeIds,
    candidatePoolSize,
    resultCount,
  };

  const result = await discoverRepos(token, options);

  return NextResponse.json(result);
}

