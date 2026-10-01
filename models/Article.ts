import mongoose, { Document, Model, Schema } from "mongoose";

export type ArticleStatus = "draft" | "published";

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Article: Model<IArticle> =
  mongoose.models.Article ||
  mongoose.model<IArticle>("Article", articleSchema);

export default Article;