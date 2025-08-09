require('dotenv').config();
const express = require('express');
const pool = require('./db.js');

const app = express();
const port = 3000;

// Middleware untuk membaca JSON body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Halo dari server!');
});

// Rute untuk MENGAMBIL SEMUA data
app.get('/nama_tabel', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nama_tabel');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error mengambil data dari database');
  }
});

// Rute untuk MENGAMBIL SATU data berdasarkan ID
app.get('/nama_tabel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM nama_tabel WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error mengambil data dari database');
  }
});


// Rute untuk MEMBUAT data baru (POST)
app.post('/nama_tabel', async (req, res) => {
  const { name, harga } = req.body;

  if (!name || !harga) {
    return res.status(400).json({ message: 'Nama dan harga tidak boleh kosong' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO nama_tabel (name, harga) VALUES (?, ?)',
      [name, harga]
    );

    const newData = {
      id: result.insertId,
      name: name,
      harga: harga
    };

    res.status(201).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat menyimpan data ke database' });
  }
});

// --- PERUBAHAN BARU DIMULAI DI SINI ---

// Rute untuk MEMPERBARUI data berdasarkan ID (PUT)
app.put('/nama_tabel/:id', async (req, res) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;
    // Ambil data baru dari body request
    const { name, harga } = req.body;

    // Validasi sederhana
    if (!name || !harga) {
      return res.status(400).json({ message: 'Nama dan harga tidak boleh kosong' });
    }

    // Jalankan query UPDATE untuk mengubah data di database
    const [result] = await pool.query(
      'UPDATE nama_tabel SET name = ?, harga = ? WHERE id = ?',
      [name, harga, id]
    );

    // Cek apakah ada baris yang terpengaruh. Jika tidak, berarti ID tidak ditemukan.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Kirim kembali data yang sudah diperbarui
    res.json({
      id: Number(id),
      name: name,
      harga: harga
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat memperbarui data' });
  }
});

// Rute untuk MENGHAPUS data berdasarkan ID (DELETE)
app.delete('/nama_tabel/:id', async (req, res) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Jalankan query DELETE untuk menghapus data dari database
    const [result] = await pool.query('DELETE FROM nama_tabel WHERE id = ?', [id]);

    // Cek apakah ada baris yang terpengaruh. Jika tidak, berarti ID tidak ditemukan.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Kirim pesan sukses
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat menghapus data' });
  }
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
