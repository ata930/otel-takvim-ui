const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'notes.json';

// Notları getir
app.get('/notes', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
  const notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(notes);
});

// Not ekle
app.post('/notes', (req, res) => {
  const note = req.body;
  if (!note.day || !note.room || !note.text) {
    return res.status(400).json({ error: 'Eksik bilgi' });
  }

  const notes = fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    : [];

  // 🚨 Burayı EKLEDİM: Benzersiz ID ataması
  note.id = Date.now();

  notes.push(note);
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
  res.status(201).json(note); // ✅ ID ile birlikte döner
});

// Not sil
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ error: 'Dosya yok' });

  let notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const newNotes = notes.filter(note => note.id !== id);

  fs.writeFileSync(DATA_FILE, JSON.stringify(newNotes, null, 2));
  res.status(200).json({ message: 'Not silindi' });
});

app.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000');
});
