import mongoose, { Schema } from "mongoose";

// Define the schema for each borrowed book
const borrowedBookSchema = new Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowedDate: {
    type: Date,
    default: Date.now,
  },
});

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim:true,
      required: true,
    },
    librarycardnumber:{
      type :Number,
      unique:true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim:true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    borrowedBooks: [borrowedBookSchema],

  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
