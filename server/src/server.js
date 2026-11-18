import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { startJobs } from './jobs.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startJobs();
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Server startup failed: ${err.message}`);
    process.exit(1);
  });
