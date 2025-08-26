import mongoose, { Schema } from "mongoose";

const fineSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Fine = mongoose.model("Fine", fineSchema);

export default Fine;
