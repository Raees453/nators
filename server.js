const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB_URL = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database Connected!'))
  .catch((err) => console.log('Database Connection Error', err));

const DEFAULT_PORT = 80;

app.listen(DEFAULT_PORT, () => {
  console.log('Server Started at port:', DEFAULT_PORT);
});
