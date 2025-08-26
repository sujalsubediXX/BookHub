
import Book from '../modules/book.module.js';

export const getBook = async (req, res) => {
  try {
    const books = await Book.find().populate('genre', 'name');
    res.status(200).json(books);
  } catch (error) {
    console.error(`Error occurred while fetching books: ${error.message}`);
    res.status(500).json({ message: "An error occurred while fetching books.", error: error.message });
  }
};


export const searchBooks =async (req,res)=>{
  const { search, genreid } = req.query;
  let query = {};

  if (search) {
    query = { title: new RegExp(search, "i") }; // Case-insensitive search
  }

  if (genreid) {
    query.genre = genreid;
  }

  try {
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const checkAvailability = async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({isbn});

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.availableCopies > 0) {
      return res.status(200).json({ available: true });
    } else {
      return res.status(200).json({ available: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Controller method to add a book
export const addbook = async (req, res) => {
  const { title, author, description, isbn, publishedDate, genre, availableCopies, totalCopies } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image file." });
  }

  try {
    const newBook = new Book({
      title,
      author,
      description,
      image: `./bookimgs/${req.file.filename}`,  // Path to the uploaded image
      isbn,
      publishedDate,
      genre,
      availableCopies,
      totalCopies,
    });

    await newBook.save();  // Save the new book to the database
    res.status(201).json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

 
