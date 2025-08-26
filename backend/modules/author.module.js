import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    deathDate: {
      type: Date,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Aurther", authorSchema);
export default Author;
