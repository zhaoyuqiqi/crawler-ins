import { Schema, Document, model } from 'mongoose';

export interface Star {
  insStarId: string;
  avatar: string;
  starName: string;
  fullName: string;
  zhName: string;
  // 帖子数量
  postCount: number;
  // 粉丝数量
  followerCount: number;
  // 关注数量
  followingCount: number;
  // 分类
  categoryId: number;
  isDel?: number;
}

type StarSchema = Document & Star;
const Star = new Schema<StarSchema>(
  {
    insStarId: {
      type: String,
      require: true,
      unique: true,
    },
    starName: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    zhName: {
      type: String,
      required: true,
      default: '',
    },
    // 帖子数量
    postCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // 粉丝数量
    followerCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // 关注数量
    followingCount: {
      type: Number,
      required: true,
      default: 0,
    },
    categoryId: {
      type: Number,
      required: true,
      index: true
    },
    isDel: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Stars = model<StarSchema>('Stars', Star);
