const fs = require('fs');

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

dotenv.config({ path: './config.env' });

const DB_URL = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connection Successful!');
  });

const insert = async () => {
  try {
    await Tour.create(tours);
    console.log('Data created successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const clear = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted Successfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--clear') {
  clear();
} else if (process.argv[2] === '--insert') {
  insert();
}
