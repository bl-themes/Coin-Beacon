const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const DEMO_KEY = process.env.COINGECKO_API_KEY || 'CG-K2e3Lda3Byu2PoNuffrssMXr';

export default async function handler(req: any, res: any) {

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = (req.query.path as string) || '';
  
  try {
    let targetUrl = '';
    if (path.includes('global')) {
      targetUrl = `${COINGECKO_BASE}/global`;
    } else if (path.includes('coins')) {
      const page = req.query.page || '1';
      const perPage = req.query.per_page || '100';
      const vsCurrency = (req.query.vs_currency as string) || 'usd';
      targetUrl = `${COINGECKO_BASE}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
    } else {
      res.status(400).json({ error: 'Unknown route' });
      return;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'x-cg-demo-api-key': DEMO_KEY,
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `CoinGecko HTTP ${response.status}` });
      return;
    }

    const data = await response.json();
    res.status(200).json({ data, source: 'vercel-serverless' });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
}
