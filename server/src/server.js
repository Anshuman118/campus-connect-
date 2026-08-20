import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './utils/db.js';

dotenv.config();

const port = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`CampusConnect AI API running on port ${port}`);
  });
});
