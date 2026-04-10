# Endpoints to hit for each chains:
---
## **BTC & BTC-like:**

- **Transactions endpoint:** 
  - This is gonna give basic transaction information, the most important part for sorting transactions by their value in USD. This is where we find whales.

  - https://api.blockchair.com/{:btc_chain}/transactions?q=output_total_usd(10000000..)&sort=time(desc)&limit=50&key=THE_KEY

  - **{:btc_chain}:** bitcoin, bitcoin-cash, litecoin, bitcoin-sv, dogecoin, dash, groestlcoin, zcash, ecash, bitcoin/testnet

---

## **ETH:**

- **Transactions endpoint:** 
  - 