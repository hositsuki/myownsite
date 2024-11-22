'use client';

import Link from 'next/link';
import { FiRss, FiMenu, FiX, FiSearch, FiGithub, FiTwitter } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { AdminEntry } from './AdminEntry';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import Logo from './Logo';

const navItems = [
  { href: '/', label: '首页', icon: 'FiHome' },
  { href: '/blog', label: '博客', icon: 'FiBook' },
  { href: '/about', label: '关于', icon: 'FiUser' },
  { href: '/rss', label: 'RSS订阅', icon: 'FiRss' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 处理滚动效果
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-3 py-2"
              >
                <span className="relative z-10 text-gray-600 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block"
                >
                  <Input
                    type="search"
                    placeholder="搜索文章..."
                    className="w-64 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:bg-blue-50"
              >
                <FiSearch className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <FiGithub className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <FiTwitter className="h-5 w-5" />
              </Button>
              <AdminEntry />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <FiMenu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-lg text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Separator />
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <FiGithub className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FiTwitter className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
