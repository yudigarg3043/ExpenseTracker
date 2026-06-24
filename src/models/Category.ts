import mongoose, { Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Category type is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    color: {
      type: String,
      default: '#3b82f6', // Default blue color
    },
  },
  { timestamps: true }
);

const Category = models.Category || model('Category', categorySchema);

export default Category;
