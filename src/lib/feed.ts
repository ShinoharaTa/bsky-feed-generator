interface TagResponse {
  result: string;
  tag: string;
}

interface AnalysedResponse {
  result: string;
  token: [string, ...string[]][];
}

interface RegisterParams {
  rkey: string;
  handle: string;
  display_name: string;
  description: string;
  condition: string;
  secret: string;
}

const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'https://api.example.com/';

export async function analyze(text: string): Promise<AnalysedResponse> {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return await response.json();
}

export async function getTag(rkey: string, handle: string, secret: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/tag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rkey,
      handle,
      secret
    })
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }
  const resultData = await response.json() as TagResponse
  return resultData.tag;
}

export async function registerFeed(params: RegisterParams): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/reg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error('Publish failed');
  }

  return await response.json();
}