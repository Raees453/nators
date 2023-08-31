const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB_URL = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

console.log('DB URL', DB_URL);

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connection Successful!');
  })
  .then((data) => data.json())
  .then((data) => console.log('Database Connected!', data))
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB Atlas');
});

const DEFAULT_PORT = 3000;

app.listen(DEFAULT_PORT, () => {
  console.log('Server Started at port: ', DEFAULT_PORT);
});
