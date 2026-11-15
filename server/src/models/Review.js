import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: [1000, 'Review is too long'] },
  },
  { timestamps: true }
);
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
