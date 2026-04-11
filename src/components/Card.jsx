import { useEffect, useRef } from 'react';

const CHAIN_LABELS = {
  "bitcoin":      "Bitcoin",
  "bitcoin-cash": "Bitcoin Cash",
  "litecoin":     "Litecoin",
  "dogecoin":     "Dogecoin",
  "dash":         "Dash",
  "groestlcoin":  "Groestlcoin",
  "zcash":        "Zcash",
  "ecash":        "eCash",
  "ethereum":     "Ethereum",
};

const CHAIN_TICKER = {
  "bitcoin":      "BTC",
  "bitcoin-cash": "BCH",
  "litecoin":     "LTC",
  "dogecoin":     "DOGE",
  "dash":         "DASH",
  "groestlcoin":  "GRS",
  "zcash":        "ZEC",
  "ecash":        "XEC",
  "ethereum":     "ETH",
};

function formatUSD(amount) {
  return "$" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function truncateHash(hash) {
  return hash.slice(0, 8) + "···" + hash.slice(-8);
}

function formatTime(timeStr) {
  // "2026-04-11 18:26:39" → "18:26:39"
  return timeStr.split(" ")[1];
}

function Card({ data }) {
  const { chain, txs, fetchedAt } = data;
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const totalVolume = txs.reduce((sum, tx) => sum + (tx.output_total_usd || 0), 0);
  const label = CHAIN_LABELS[chain] || chain;
  const ticker = CHAIN_TICKER[chain] || chain.toUpperCase();

  return (
    <div
      ref={cardRef}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      className="w-full max-w-2xl border border-neutral-700 bg-neutral-950 rounded-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700 bg-neutral-900">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 tracking-widest uppercase">whale alert</span>
          <span className="text-xs text-neutral-600">·</span>
          <span className="text-sm font-semibold text-white tracking-wide">{label}</span>
          <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-sm">{ticker}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">{new Date(fetchedAt).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Volume Summary */}
      <div className="px-4 py-3 border-b border-neutral-800">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">batch volume</p>
        <p className="text-2xl font-bold text-emerald-400 tracking-tight">{formatUSD(totalVolume)}</p>
        <p className="text-xs text-neutral-500 mt-1">{txs.length} transaction{txs.length !== 1 ? "s" : ""} in this batch</p>
      </div>

      {/* Transaction Rows */}
      <div className="divide-y divide-neutral-800">
        {txs.map((tx) => (
          <div key={tx.hash} className="px-4 py-3 hover:bg-neutral-900 transition-colors duration-150">
            <div className="flex items-start justify-between gap-4">

              {/* Left: hash + time */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs text-amber-400 truncate">{truncateHash(tx.hash)}</span>
                <span className="text-xs text-neutral-500">{formatTime(tx.time)}</span>
              </div>

              {/* Right: amount + fee */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-semibold text-white">{formatUSD(tx.output_total_usd)}</span>
                <span className="text-xs text-neutral-500">fee {formatUSD(tx.fee_usd)}</span>
              </div>

            </div>

            {/* Inputs / Outputs */}
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-neutral-600">{tx.input_count} input{tx.input_count !== 1 ? "s" : ""}</span>
              <span className="text-xs text-neutral-600">{tx.output_count} output{tx.output_count !== 1 ? "s" : ""}</span>
              {tx.is_coinbase && (
                <span className="text-xs text-yellow-600 bg-yellow-950 px-1.5 rounded-sm">coinbase</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;