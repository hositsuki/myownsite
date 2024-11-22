'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FiGithub, FiMail, FiBook, FiRss, FiTwitter, FiLinkedin } from 'react-icons/fi';

interface LinkItem {
  name: string;
  href: string;
  icon?: IconType;
}

interface Section {
  title: string;
  links: LinkItem[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: IconType;
}

const footerLinks: Section[] = [
  {
    title: '导航',
    links: [
      { name: '首页', href: '/' },
      { name: '博客', href: '/blog' },
      { name: '关于', href: '/about' },
      { name: 'RSS', href: '/rss' },
    ],
  },
  {
    title: '社交媒体',
    links: [
      { name: 'GitHub', href: 'https://github.com/yukiice', icon: FiGithub },
      { name: '掘金', href: 'https://juejin.cn/user/1591748568815645', icon: FiBook },
      { name: '邮箱', href: 'mailto:yukiice@163.com', icon: FiMail },
      { name: 'RSS', href: '/rss', icon: FiRss },
    ],
  },
];

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/yukiice',
    icon: FiGithub,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/yukiice',
    icon: FiTwitter,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yukiice',
    icon: FiLinkedin,
  },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block"
              >
                Yuki的个人网站
              </motion.div>
            </Link>
            <p className="text-gray-600 text-sm">
              分享技术，记录生活，探索未知的可能性。
            </p>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 group"
                    >
                      {link.icon && (
                        <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      )}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              {new Date().getFullYear()} Yuki. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                使用条款
              </Link>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600 text-sm">
                Made with ❤️ by Yuki
              </span>
              <div className="flex justify-center space-x-6">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
