interface AnalysedResponse {
  result: string;
  token: [string, ...string[]][];
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

  return response.json();
}