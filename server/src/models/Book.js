import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    image: { type: String, required: [true, 'Cover image is required'], trim: true }, // '/uploads/xyz.jpg' (uploaded) or a full image URL
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true, trim: true },
    publishedDate: { type: Date, required: [true, 'Published date is required'] },
    genre: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
      validate: [(v) => v.length > 0, 'Choose at least one genre'],
    },
    language: { type: String, default: 'English', trim: true },
    publisher: { type: String, trim: true },
    shelf: { type: String, trim: true },

    // rental shop fields
    pricePerDay: { type: Number, required: [true, 'Rental price per day is required'], min: [0, 'Price cannot be negative'], default: 10 },
    totalCopies: { type: Number, required: true, min: [1, 'At least 1 copy is required'], default: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, min: 0, default: 2 },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ createdAt: -1 });
bookSchema.index({ genre: 1 });

export default mongoose.model('Book', bookSchema);
