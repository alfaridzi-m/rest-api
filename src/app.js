require('dotenv').config();
const express = require('express');
const pool = require('./db.js'); // <-- 1. Impor "jembatan" database kita

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Halo dari server!');
});

// 2. Buat rute baru untuk mengambil semua produk
app.get('/nama_tabel', async (req, res) => {
  try {
    // 3. Jalankan query SQL untuk mengambil data
    const [rows] = await pool.query('SELECT * FROM nama_tabel');
    // 4. Kirim hasilnya sebagai balasan JSON
    res.json(rows);
  } catch (err) {
    // Tangani jika ada error
    console.error(err);
    res.status(500).send('Error mengambil data dari database');
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});