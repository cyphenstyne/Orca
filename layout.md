# whale_hunter layout (code-only)

## flow
`src/main.jsx` -> `src/App.jsx` -> `src/pages/MainFeed.jsx` -> `src/services/fetchData.js` + `src/services/allChains.js` -> `src/components/Card.jsx`

## files
`src/main.jsx`
- `createRoot(...).render(<App/>)` -> app mount

`src/App.jsx`
- `App()` -> returns `<MainFeed/>`

`src/pages/MainFeed.jsx`
- consts -> whale rule + polling limits
  - `WHALE_THRESHOLD_USD=10000000`
  - `LIMIT=10`
  - `CHAIN_INTERVAL_MS=20000`
  - `MAX_BATCHES=20`
- state/refs
  - `batches` -> recent fetch groups
  - `error` -> API fail msg
  - `chainIndexRef` -> next chain pointer
  - `seenHashesRef` -> de-dupe tx hashes
- `useEffect()`
  - `pollNextChain()`
    - pick chain (`BTC_CHAINS[i]`) -> rotate index
    - call `fetchChain(chain,threshold,limit)`
    - get txs -> remove seen hashes
    - if new txs -> build `batch{id,chain,txs,fetchedAt}` -> prepend -> trim to `MAX_BATCHES`
    - set/clear error
  - run once now + `setInterval` loop
  - cleanup -> `clearInterval`
- render -> black page, error text, map `batches -> <Card data={batch}/>`

`src/components/Card.jsx`
- maps
  - `CHAIN_LABELS` -> chain id -> full name
  - `CHAIN_TICKER` -> chain id -> ticker
- helpers
  - `formatUSD(n)` -> `$` + localized int
  - `truncateHash(h)` -> first8 + `···` + last8
  - `formatTime(t)` -> `HH:MM:SS` from `YYYY-MM-DD HH:MM:SS`
- `Card({data})`
  - unpack `chain,txs,fetchedAt`
  - `useEffect` -> fade/slide-in on mount
  - `totalVolume` -> sum `tx.output_total_usd`
  - resolve `label/ticker`
  - render card:
    - header -> alert + chain + fetch time
    - summary -> batch USD + tx count
    - rows -> hash/time + amount/fee + input/output + coinbase badge

`src/services/fetchData.js`
- `API_KEY` <- `import.meta.env.VITE_BLOCKCHAIR_KEY`
- `buildUrl(chain,threshold,limit)` -> Blockchair tx URL (`output_total_usd(threshold..)` + sort + limit + key)
- `fetchChain(chain,threshold,limit)`
  - build url -> `fetch`
  - if !ok -> throw `[chain] HTTP ...`
  - parse json -> return `{chain,data}`

`src/services/allChains.js`
- `BTC_CHAINS` -> active poll list
- `ETH_CHAINS` -> defined, unused
- `OTHER_CHAINS` -> defined, unused

`src/services/dataFormatter.js`
- empty (no code)

`src/index.css`
- `@import "tailwindcss"`
- `body{background:black}` (overscroll white fix)
