require('dotenv').config();
const express = require('express');
const pool = require('./db.js');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Halo dari server!');
});

//Bagian GET
app.get('/harga_barang', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM harga_barang');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error mengambil data dari database');
  }
});

//Bagian GET dengan parameter
app.get('/harga_barang/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM harga_barang WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error mengambil data dari database');
  }
});


// Bagian POST
app.post('/harga_barang', async (req, res) => {
  const { name, harga } = req.body;

  if (!name || !harga) {
    return res.status(400).json({ message: 'Nama dan harga tidak boleh kosong' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO harga_barang (name, harga) VALUES (?, ?)',
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

// Bagian PUT
app.put('/harga_barang/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, harga } = req.body;
    if (!name || !harga) {
      return res.status(400).json({ message: 'Nama dan harga tidak boleh kosong' });
    }
    const [result] = await pool.query(
      'UPDATE harga_barang SET name = ?, harga = ? WHERE id = ?',
      [name, harga, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
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

// Bagian DELETE
app.delete('/harga_barang/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM harga_barang WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat menghapus data' });
  }
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});