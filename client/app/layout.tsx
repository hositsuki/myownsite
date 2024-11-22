'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Notifications } from '@/components/ui/Notification';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 模拟数据
const mockData = {
  categories: [
    { name: '技术', count: 12, slug: 'tech' },
    { name: '生活', count: 8, slug: 'life' },
    { name: '思考', count: 5, slug: 'thoughts' },
  ],
  tags: [
    { name: 'React', count: 8, slug: 'react' },
    { name: 'TypeScript', count: 6, slug: 'typescript' },
    { name: 'Next.js', count: 4, slug: 'nextjs' },
  ],
  recentPosts: [
    { title: '使用Next.js 13构建现代化博客', slug: 'building-blog-with-nextjs', date: '2023-12-01' },
    { title: 'TypeScript高级特性详解', slug: 'typescript-advanced', date: '2023-11-28' },
    { title: '前端性能优化实践', slug: 'frontend-performance', date: '2023-11-25' },
  ],
  popularPosts: [
    { title: 'React Hooks最佳实践', slug: 'react-hooks-best-practices', views: 1234 },
    { title: '现代化前端工程化指南', slug: 'frontend-engineering', views: 987 },
    { title: 'TypeScript类型体操详解', slug: 'typescript-type-challenges', views: 876 },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <ErrorBoundary>
          <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                <div className="container mx-auto px-4 pt-20 pb-16">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Content Area */}
                    <main className="flex-1">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        {children}
                      </div>
                    </main>

                    {/* Sidebar */}
                    <div className="lg:w-80">
                      <div className="sticky top-24">
                        <Sidebar
                          categories={mockData.categories}
                          tags={mockData.tags}
                          recentPosts={mockData.recentPosts}
                          popularPosts={mockData.popularPosts}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <Footer />

                {/* Notifications */}
                <Notifications />
              </ThemeProvider>
            </QueryClientProvider>
          </WagmiConfig>
        </ErrorBoundary>
      </body>
    </html>
  );
}
