import dotenv from 'dotenv'
import connectDB from '../config/database'
import Project from '../models/Project'

dotenv.config()

const testConnection = async () => {
  try {
    await connectDB()

    // Test creating a project
    const testProject = new Project({
      title: 'Test Project',
      description: 'This is a test project to verify MongoDB Atlas connection',
      technologies: ['Node.js', 'MongoDB Atlas'],
      image: 'https://example.com/test.jpg',
      link: 'https://example.com',
      featured: true,
    })

    await testProject.save()
    console.log('✅ Test project created successfully')

    // Fetch the project
    const projects = await Project.find()
    console.log('📚 Current projects in database:', projects)

    // Clean up
    await Project.deleteOne({ title: 'Test Project' })
    console.log('🧹 Test project cleaned up')

    process.exit(0)
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  }
}

testConnection()
