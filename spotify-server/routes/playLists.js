import { Router } from 'express';
import mongoose from 'mongoose';
import { PlayList, validatePlayList } from '../models/playList.js'; // Adjust path as needed

const router = Router();

// POST: Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { error } = validatePlayList(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { name, description, songs, user } = req.body;

    if (!Array.isArray(songs)) {
      return res.status(400).send({ message: '"songs" must be an array' });
    }

    const songsObjectIds = songs.map(songId => mongoose.Types.ObjectId(songId));

    if (!user) {
      return res.status(400).send({ message: '"user" is required' });
    }

    const playList = new PlayList({
      name,
      description,
      songs: songsObjectIds,
      user
    });

    await playList.save();
    res.status(201).send({ data: playList, message: 'Playlist created successfully' });
  } catch (err) {
    console.error('Error creating playlist:', err.message);
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

// GET: Retrieve all playlists
router.get('/', async (req, res) => {
  try {
    const playLists = await PlayList.find().populate('songs', 'title artist'); // Ensure 'title artist' exists in Song model
    res.status(200).send({ data: playLists });
  } catch (err) {
    console.error('Error retrieving playlists:', err.message);
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

// GET: Retrieve a specific playlist by its ID
router.get('/:id', async (req, res) => {
  try {
    const playList = await PlayList.findById(req.params.id).populate('songs', 'title artist'); // Ensure 'title artist' exists in Song model
    if (!playList) return res.status(404).send({ message: 'Playlist not found' });

    res.status(200).send({ data: playList });
  } catch (err) {
    console.error('Error retrieving playlist:', err.message);
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

export default router;
