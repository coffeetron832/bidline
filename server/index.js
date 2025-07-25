const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// Simulación de base de datos
const VIDEO_DB_PATH = path.join(__dirname, 'data', 'videos.json');

function saveVideoInfo(info) {
  let db = [];
  if (fs.existsSync(VIDEO_DB_PATH)) {
    db = JSON.parse(fs.readFileSync(VIDEO_DB_PATH));
  }
  db.push(info);
  fs.writeFileSync(VIDEO_DB_PATH, JSON.stringify(db, null, 2));
}

app.post('/upload', upload.single('video'), (req, res) => {
  const { title, description } = req.body;

  const videoInfo = {
    id: Date.now(),
    filename: req.file.filename,
    title,
    description,
    status: 'pendiente',
    uploadDate: new Date().toISOString()
  };

  saveVideoInfo(videoInfo);

  res.json({ message: 'Video enviado para revisión.' });
});

app.get('/review-pendientes', (req, res) => {
  if (!fs.existsSync(VIDEO_DB_PATH)) return res.json([]);

  const db = JSON.parse(fs.readFileSync(VIDEO_DB_PATH));
  const pendientes = db.filter(v => v.status === 'pendiente');
  res.json(pendientes);
});

app.post('/review/:id/:action', (req, res) => {
  const { id, action } = req.params;
  if (!fs.existsSync(VIDEO_DB_PATH)) return res.status(404).end();

  let db = JSON.parse(fs.readFileSync(VIDEO_DB_PATH));
  db = db.map(v => {
    if (v.id == id) v.status = action === 'aceptar' ? 'aceptado' : 'rechazado';
    return v;
  });
  fs.writeFileSync(VIDEO_DB_PATH, JSON.stringify(db, null, 2));
  res.json({ message: 'Actualizado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
