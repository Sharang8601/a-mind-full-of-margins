import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string; // Stored as JSON string to support the block editor
  tags: string[];
  readingTime: string;
  status: "Draft" | "Published";
  date: string;
  seoTitle?: string;
  seoDesc?: string;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    readingTime: { type: String, required: true },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    date: { type: String, required: true },
    seoTitle: { type: String },
    seoDesc: { type: String },
  },
  {
    timestamps: true,
  }
);

// Virtual for 'id' mapping to '_id' so the frontend works seamlessly
ArticleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
ArticleSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
