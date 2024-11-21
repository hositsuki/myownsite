# Personal Website

A modern, responsive personal blog and portfolio website built with Next.js 13 and TypeScript.

## Features

- 🚀 Built with Next.js 13 App Router
- 💎 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🌟 Framer Motion animations
- 📱 Fully responsive design
- 🔒 API routes with Express backend
- 🗄️ MongoDB database
- 🔐 JWT authentication
- 📝 Rich text editor for blog posts
- 🖼️ Image optimization with Cloudinary CDN
- 🤖 AI-powered features (tags generation, reading time estimation)
- 💾 Redis caching for improved performance
- 🔍 Full-text search capability
- 🏷️ Tag-based article categorization
- 📊 Analytics dashboard
- 🔄 Auto-deployment with CI/CD

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB Atlas account
- Cloudinary account
- Redis (via Upstash)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` in the root directory and update the environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The website should now be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
personal-website/
├── client/                 # Next.js frontend
│   ├── app/               # Next.js 13 app directory
│   ├── components/        # React components
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # MongoDB models
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Custom middleware
│   └── package.json
└── package.json
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push`

### Backend (Railway)
1. Create new project in Railway
2. Add your GitHub repository
3. Configure environment variables
4. Deploy with `git push`

### Database
- MongoDB: Use MongoDB Atlas
- Redis: Use Upstash
- Images: Use Cloudinary

### Environment Variables

Required environment variables:
```env
# Application
NODE_ENV=production
SERVER_PORT=5000

# Database
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url

# Authentication
JWT_SECRET=your_jwt_secret
IMAGE_ENCRYPTION_KEY=your_key

# Services
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
OPENAI_API_KEY=your_key
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

## Technologies Used

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- TipTap Editor
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Redis
- JWT
- Cloudinary
- OpenAI

### Infrastructure
- Vercel (Frontend hosting)
- Railway (Backend hosting)
- MongoDB Atlas (Database)
- Upstash (Redis)
- Cloudinary (CDN)
- GitHub Actions (CI/CD)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

🚀 CI/CD Status: Active
Last updated: {{ new Date().toISOString() }}
