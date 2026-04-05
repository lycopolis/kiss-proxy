const express = require('express');
const fetch = require('node-fetch');
const app = express();

const API_KEY = process.env.MASSIVE_API_KEY;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Stock/ETF price
app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const url = `https://api.massive.com/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${API_KEY}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Option quote with greeks
app.get('/options/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { expiration_date, strike_price, contract_type } = req.query;
  const url = `https://api.massive.com/v3/snapshot/options/${ticker}?expiration_date=${expiration_date}&strike_price=${strike_price}&contract_type=${contract_type}&apiKey=${API_KEY}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Option chain (all strikes for a ticker/expiry)
app.get('/chain/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { expiration_date, contract_type, cursor } = req.query;
  let url = `https://api.massive.com/v3/snapshot/options/${ticker}?expiration_date=${expiration_date}&contract_type=${contract_type}&apiKey=${API_KEY}`;
  if(cursor) url += `&cursor=${cursor}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Debug
app.get('/debug/:ticker', async (req, res) => {
  const stockUrl = `https://api.massive.com/v2/snapshot/locale/us/markets/stocks/tickers/${req.params.ticker}?apiKey=${API_KEY}`;
  try {
    const r = await fetch(stockUrl);
    const text = await r.text();
    res.json({ status: r.status, url: stockUrl, preview: text.substring(0, 500) });
  } catch(e) {
    res.json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KISS proxy running on port ${PORT}`));
