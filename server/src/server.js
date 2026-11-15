import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { startJobs } from './jobs.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startJobs();
    app.listen(PORT);
  })
  .catch((err) => {
    process.exit(1);
  });
