import { NextRequest, NextResponse } from 'next/server';
import { discoverRepos, DiscoverOptions } from '@/lib/github/discover';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    genre: searchParams.get('genre') || undefined,
    language: searchParams.get('language') || undefined,
    os: searchParams.get('os') || undefined,
    minStars: searchParams.get('minStars') ? parseInt(searchParams.get('minStars')!, 10) : undefined,
  };

  const genres = searchParams.get('genres') ? JSON.parse(searchParams.get('genres')!) : undefined;
  const excludeIds = searchParams.get('excludeIds') ? JSON.parse(searchParams.get('excludeIds')!) : [];
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

