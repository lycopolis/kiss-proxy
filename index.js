const express = require('express');
const fetch = require('node-fetch');
const app = express();

const API_KEY = process.env.MASSIVE_API_KEY;
const BASE = 'https://api.massive.com/v3';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Stock/ETF price: /stocks/GLD
app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    const url = `${BASE}/quotes/${ticker}?apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Option quote using full OCC symbol: /options/O:GLD270115C00440000
app.get('/options/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const url = `${BASE}/quotes/${symbol}?apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Option chain: /chain/GLD/2027-01-15/call
app.get('/chain/:ticker/:expiry/:type', async (req, res) => {
  const { ticker, expiry, type } = req.params;
  try {
    // Convert expiry YYYY-MM-DD to YYMMDD
    const [yr, mo, dy] = expiry.split('-');
    const yy = yr.slice(2);
    const cp = type.toLowerCase() === 'call' ? 'C' : 'P';
    // Fetch a range of strikes by querying the options reference
    const url = `${BASE}/reference/options?underlying_ticker=${ticker}&expiration_date=${expiry}&contract_type=${type}&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Build OCC symbol helper: /build-symbol?ticker=GLD&expiry=2027-01-15&strike=440&type=call
app.get('/build-symbol', (req, res) => {
  const { ticker, expiry, strike, type } = req.query;
  try {
    const [yr, mo, dy] = expiry.split('-');
    const yy = yr.slice(2);
    const cp = type.toLowerCase() === 'call' ? 'C' : 'P';
    const strikeFormatted = Math.round(parseFloat(strike) * 1000)
      .toString().padStart(8, '0');
    const symbol = `O:${ticker.toUpperCase()}${yy}${mo}${dy}${cp}${strikeFormatted}`;
    res.json({ symbol });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Debug endpoint
app.get('/debug/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const url = `${BASE}/quotes/${ticker}?apiKey=${API_KEY}`;
  try {
    const r = await fetch(url);
    const text = await r.text();
    res.json({
      status: r.status,
      url_called: url,
      body_preview: text.substring(0, 1000)
    });
  } catch(e) {
    res.json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KISS proxy running on port ${PORT}`));
