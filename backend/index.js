import express from 'express';
import dotenv from 'dotenv';
import bookRoute from './route/book.routes.js';
import genreRoute from './route/genre.routes.js';
import cors from 'cors';
import userRoute from './route/user.routes.js';
import commentRouter from './route/comment.routes.js';
import bodyParser from 'body-parser'; 
import { userInfo } from './controller/user.controller.js';
import Genre from './modules/genre.module.js';
import Book from './modules/book.module.js';
import dbconnection from './database/db.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json()); 

dbconnection().then(()=>{

// Routes
app.use("/", bookRoute);
app.use("/comment", commentRouter);
app.use("/user", userRoute);
app.use("/", genreRoute);
app.post("/profile", userInfo);



app.delete('/genre/:id',async(req,res)=>{
  try{
    const {id}=req.params;
    const genre=await Genre.findByIdAndDelete(id);
    res.status(200).json({ message: 'Genre deleted successfully' });
  }catch(error){
    console.error('Error deleting this Genre:', error);
    res.status(500).json({ message: 'Error deleting this Genre.', error: error.message });
  }
})
app.get('/editbook/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the book ID from the route
    const bookinfo = await Book.findById(id); // Fetch the book without deleting it

    if (!bookinfo) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Send the book data back in response
    res.status(200).json(bookinfo);
  } catch (error) {
    console.error('Error fetching the book in editbook:', error);
    res.status(500).json({ message: 'Error fetching book in edit book.', error: error.message });
  }
});


app.delete('/deletebook/:_id',async(req,res)=>{
  try{
    const {_id}=req.params;
    const book=await Book.findByIdAndDelete(_id);
    res.status(200).json({ message: 'Book deleted successfully' });
  }catch(error){
    console.error('Error deleting this book:', error);
    res.status(500).json({ message: 'Error deleting this Genre.', error: error.message });
  }
})
app.put('/genre/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { name } = req.body; // Get new name from the request body

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Find the category by ID
    const category = await Genre.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category's name
    category.name = name;
    const updatedCategory = await category.save(); // Save the updated category

    // Return the updated category
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(`Error occurred while editing category: ${error.message}`);
    res.status(500).json({ message: "Internal server error in Category." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
})
