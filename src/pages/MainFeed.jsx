import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { BTC_CHAINS } from '../services/allChains';
import { fetchChain } from '../services/fetchData';

const WHALE_THRESHOLD_USD = 10000000;
const LIMIT = 10;
const CHAIN_INTERVAL_MS = 20000;
const MAX_TRANSACTIONS = 50;

function MainFeed() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const chainIndexRef = useRef(0);
  const seenHashesRef = useRef(new Set());

  useEffect(() => {
    async function pollNextChain() {
      const chain = BTC_CHAINS[chainIndexRef.current];
      chainIndexRef.current = (chainIndexRef.current + 1) % BTC_CHAINS.length;

      try {
        const result = await fetchChain(chain, WHALE_THRESHOLD_USD, LIMIT);
        const rawTxs = result.data.data; // blockchair wraps in .data.data

        const newTxs = rawTxs
          .filter(tx => !seenHashesRef.current.has(tx.hash))
          .map(tx => ({ ...tx, chain })); // tag each tx with its chain

        newTxs.forEach(tx => seenHashesRef.current.add(tx.hash));

        setTransactions(prev =>
          [...newTxs, ...prev].slice(0, MAX_TRANSACTIONS)
        );
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
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-6 py-8 px-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {transactions.map(tx => (
        <Card key={tx.hash} data={tx} />
      ))}
    </div>
  );
}

export default MainFeed;