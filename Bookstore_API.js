const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const bookSchema = new mongoose.Schema({
    name: String,
    logo: String,
});

const Book = mongoose.model('Book', bookSchema);

app.use(express.json())

app.get('/Book', async (request, response) => {
    try {
      const books = await Book.find();
      response.status(200).send(books);
    } catch (error) {
      response.status(500).send({ message: 'Internal Server Error' });
    }
});
  
app.post('/Book', async (request, response) => {
    const { name, logo } = request.body;

    if (!name || !logo) {
        response.status(400).send({ message: 'Name and Logo are required fields.' });
        return;
    }

    try {
        const newBook = await Book.create({ name, logo });
        response.status(201).send(newBook);
    } catch (error) {
        response.status(500).send({ message: 'Internal Server Error' });
    }
});


app.listen(
    PORT,
    () => console.log(`Its alive on http://localhost:${PORT}`)
)