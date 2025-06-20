import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('🎵 Welcome to the Music API!');
});

app.get('/songs', (req, res) => {
  const songs = JSON.parse(fs.readFileSync(path.join(__dirname, 'songs.json')));
  res.json(songs);
});

app.get('/playlists', (req, res) => {
  const pls = JSON.parse(fs.readFileSync(path.join(__dirname, 'playlists.json')));
  res.json(pls);
});

app.post('/songs', (req, res) => {
  const songsPath = path.join(__dirname, 'songs.json');
  const songs = JSON.parse(fs.readFileSync(songsPath));
  const newSong = { id: Date.now(), ...req.body };
  songs.push(newSong);
  fs.writeFileSync(songsPath, JSON.stringify(songs, null, 2));
  res.status(201).json(newSong);
});

app.post('/playlists', (req, res) => {
  const playlistsPath = path.join(__dirname, 'playlists.json');
  const pls = JSON.parse(fs.readFileSync(playlistsPath));
  const newPl = { id: Date.now(), ...req.body };
  pls.push(newPl);
  fs.writeFileSync(playlistsPath, JSON.stringify(pls, null, 2));
  res.status(201).json(newPl);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
