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

app.get('/options/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { expiration_date, strike_price, contract_type } = req.query;
  try {
    const url = `${BASE}/snapshot/options/${ticker}?expiration_date=${expiration_date}&strike_price=${strike_price}&contract_type=${contract_type}&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    const url = `${BASE}/snapshot/stocks/${ticker}?apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/chain/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { expiration_date, contract_type } = req.query;
  try {
    const url = `${BASE}/snapshot/options/${ticker}?expiration_date=${expiration_date}&contract_type=${contract_type}&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KISS proxy running on port ${PORT}`));
