
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import 'express-async-errors'; // For handling async errors

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import * as playListRoutes from './routes/playLists.js'; // Adjust import if not using default
import auth from './middleware/auth.js';

dotenv.config();

const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/login', authRoutes); // Register authRoutes
app.use('/api/playlists', playListRoutes.default); // Use default if using named imports

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Listening on port ${port}...`));