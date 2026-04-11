const API_KEY = import.meta.env.VITE_BLOCKCHAIR_KEY;

function buildUrl(chain, threshold, limit) {
  return (
    `https://api.blockchair.com/${chain}/transactions` +
    `?q=output_total_usd(${threshold}..)` +
    `&s=id(desc)` +
    `&limit=${limit}` +
    `&key=${API_KEY}`
  );
}

export async function fetchChain(chain, threshold, limit) {
  const url = buildUrl(chain, threshold, limit);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`[${chain}] HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return { chain, data: json };
}