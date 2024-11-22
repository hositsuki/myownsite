import dotenv from 'dotenv'
import connectDB from '../config/database'
import { Post } from '../models/Post'
import { User } from '../models/User'

dotenv.config()

const testConnection = async () => {
  try {
    await connectDB()
    console.log('✅ Successfully connected to MongoDB')

    // 测试获取用户
    const users = await User.find().limit(1)
    console.log('👥 Users in database:', users.length)

    // 测试获取文章
    const posts = await Post.find().limit(1)
    console.log('📝 Posts in database:', posts.length)

    process.exit(0)
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  }
}

testConnection()
