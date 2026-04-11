import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { BTC_CHAINS } from '../services/allChains';
import { fetchChain } from '../services/fetchData';

const WHALE_THRESHOLD_USD = 10000000;
const LIMIT = 10;
const CHAIN_INTERVAL_MS = 20000;
const MAX_BATCHES = 20;

function MainFeed() {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const chainIndexRef = useRef(0);
  const seenHashesRef = useRef(new Set());

  useEffect(() => {
    async function pollNextChain() {
      const chain = BTC_CHAINS[chainIndexRef.current];
      chainIndexRef.current = (chainIndexRef.current + 1) % BTC_CHAINS.length;

      try {
        const result = await fetchChain(chain, WHALE_THRESHOLD_USD, LIMIT);
        const rawTxs = result.data.data;

        // filter out txs we've already seen
        const newTxs = rawTxs.filter(tx => !seenHashesRef.current.has(tx.hash));

        // only add a card if there's actually something new
        if (newTxs.length > 0) {
          newTxs.forEach(tx => seenHashesRef.current.add(tx.hash));

          const batch = {
            id: `${chain}-${Date.now()}`,
            chain,
            txs: newTxs,
            fetchedAt: Date.now(),
          };

          setBatches(prev => [batch, ...prev].slice(0, MAX_BATCHES));
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }

    pollNextChain();
    const intervalId = setInterval(pollNextChain, CHAIN_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center gap-6 py-8 px-4">
      {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
      {batches.map(batch => (
        <Card key={batch.id} data={batch} />
      ))}
    </div>
  );
}

export default MainFeed;