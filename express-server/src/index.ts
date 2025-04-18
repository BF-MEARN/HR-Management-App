import dotenv from 'dotenv';

import app from './app.js';
import db from './config/connection.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
