import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description:{
      type:String,
      required:true,
    },
    image: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    publishedDate: { 
      type: Date, 
      required: true 
    },
    genre:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Genre',
        required:true
      },
    ],
    availableCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
