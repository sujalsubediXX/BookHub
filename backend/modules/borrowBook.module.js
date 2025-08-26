import mongoose, { Schema } from "mongoose";

const borrowSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    borrowedDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required:true,
    },
    Notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
