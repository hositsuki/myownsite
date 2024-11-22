import React from 'react';
import Link from 'next/link';
import { FiRss } from 'react-icons/fi';
import { SiRss, SiAtom, SiJson } from 'react-icons/si';
import SubscriptionPayment from '@/components/SubscriptionPayment';

const RSSPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Subscribe to My Blog</h1>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
          Stay updated with my latest posts through your preferred feed reader or subscribe for premium content.
        </p>

        {/* Free RSS Feeds */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Free RSS Feeds</h2>
          <div className="space-y-4">
            <a
              href="/api/rss"
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <SiRss className="h-5 w-5" />
              <span>RSS Feed</span>
            </a>
            <a
              href="/api/rss/atom"
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <SiAtom className="h-5 w-5" />
              <span>Atom Feed</span>
            </a>
            <a
              href="/api/rss/json"
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <SiJson className="h-5 w-5" />
              <span>JSON Feed</span>
            </a>
          </div>
        </div>

        {/* Premium Subscription */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Premium Subscription</h2>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Early access to new posts</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Exclusive content</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Direct communication channel</span>
            </li>
          </ul>
          
          <SubscriptionPayment />
          
          <p className="text-sm text-blue-100 mt-4 text-center">
            Only $5/month or 0.002 ETH
          </p>
        </div>

        {/* Popular RSS Readers */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Popular RSS Readers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="https://feedly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <img src="/images/feedly-logo.png" alt="Feedly" className="h-8 mx-auto mb-2" />
              <span>Feedly</span>
            </a>
            <a
              href="https://inoreader.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <img src="/images/inoreader-logo.png" alt="Inoreader" className="h-8 mx-auto mb-2" />
              <span>Inoreader</span>
            </a>
            <a
              href="https://newsblur.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <img src="/images/newsblur-logo.png" alt="NewsBlur" className="h-8 mx-auto mb-2" />
              <span>NewsBlur</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSSPage;
