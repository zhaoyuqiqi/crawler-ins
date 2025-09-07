import { Schema, Document, model } from 'mongoose';
import { Post } from '../ins/upload';

type PostSchema = Document & Post;

const postSchema = new Schema<PostSchema>(
  {
    insPostId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    starName: {
      type: String
    },
    fullName: {
      type: String
    },
    title: {
      type: String
    },
    isTop: {
      type: Boolean
    },
    publishTime: {
      type: Number,
      required: true,
      index: -1
    },
    insStarId: {
      type: String,
      required: true,
      index: true
    },
    resources: [
      {
        url: String,
        type: {
          type: String,
          enum: ['image', 'video']
        },
        thumbnail_url: String,
        width: {
          type: Number,
          required: false
        },
        height: {
          type: Number,
          required: false
        }
      }
    ]
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Posts = model<PostSchema>('Posts', postSchema);
