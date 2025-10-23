import mongoose from 'mongoose';
import { type Star, Stars } from '../model/star';
import { Post } from '../ins/upload';
import { Posts } from '../model/post';
import { MONGODB_CONFIG } from '../constants';

let eventsInitialized = false;
function initializeConnectionEvents() {
  if (eventsInitialized) return;
  eventsInitialized = true;

  mongoose.connection.on('connected', () => {
    console.info('Mongoose 已连接到 MongoDB');
  });

  mongoose.connection.on('disconnected', () => {
    console.info('Mongoose 已断开连接');
  });

  mongoose.connection.on('error', err => {
    console.error(`Mongoose 连接错误: ${err}`);
  });
}
export class DataBase {
  static instance: DataBase;
  constructor() {
    if (DataBase.instance) {
      return DataBase.instance;
    }
    DataBase.instance = this;
  }

  async saveUser(user: Star) {
    await Stars.updateOne(
      {
        insStarId: user.insStarId,
      },
      {
        $set: user,
      },
      {
        upsert: true,
      }
    );
  }

  async savePosts(posts: Post[]) {
    await Posts.bulkWrite(
      posts.map(post => ({
        updateOne: {
          upsert: true,
          filter: { insPostId: post.insPostId },
          update: {
            $set: post,
          },
        },
      }))
    );
  }

  async getFirstPostId(insStarId?: string) {
    const post = await Posts.findOne({
      isTop: false,
      insStarId,
    }).sort({
      publishTime: -1,
    });
    if (post) {
      return post.insPostId;
    }
  }

  async getStarWithCategoryId() {
    return Stars.find({
      categoryId: 0,
    });
  }
  async getStarByInsStarId(insStarId: string) {
    return Stars.findOne({
      insStarId,
    });
  }
  async connect() {
    initializeConnectionEvents();
    // const uri = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`;
    try {
      if (mongoose.connection.readyState === 1) {
        // noop  已连接什么都不需要做
      } else if (mongoose.connection.readyState === 2) {
        await new Promise((resolve, reject) => {
          mongoose.connection.once('connected', resolve);
          mongoose.connection.once('error', reject);
        });
      } else {
        const {user,pass, host, port} = MONGODB_CONFIG
        const uri = `mongodb://${user}:${pass}.@${host}:${port}/ins_star?authSource=admin`;
        await mongoose.connect(uri, {
          maxPoolSize: 3,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          autoIndex: false,
          maxIdleTimeMS: 10000,
        });
      }
    } catch (error) {
      console.error('❌ MongoDB 连接失败:', error);
    }
  }

  async close() {
    await mongoose.disconnect();
    console.log('数据库连接已关闭');
  }
}
