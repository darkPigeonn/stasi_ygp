const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Proxy endpoint untuk kalender liturgi
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const response = await fetch(`https://imavi.org/imavi/agendas/get-by-date/${today}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch liturgical calendar: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Liturgy API Error:', error);
    next(error);
  }
});

// Proxy endpoint untuk tanggal tertentu
router.get('/date/:date', async (req, res, next) => {
  try {
    const { date } = req.params; // Format: YYYY-MM-DD

    const response = await fetch(`https://imavi.org/imavi/agendas/get-by-date/${date}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch liturgical calendar: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Liturgy API Error:', error);
    next(error);
  }
});

module.exports = router;
