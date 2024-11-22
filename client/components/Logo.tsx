'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Logo = () => {
  // 定义动画变体
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // 定义雪花动画变体
  const snowflakeVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  return (
    <Link href="/">
      <motion.div
        className="flex items-center space-x-2 group"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Logo图标 */}
        <div className="relative w-10 h-10">
          {/* 外圈 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
            style={{ 
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
            }}
          />
          
          {/* 内圈雪花 */}
          <motion.div
            className="absolute inset-1 bg-white rounded-lg"
            style={{ 
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
            }}
            variants={snowflakeVariants}
            animate="animate"
          >
            {/* 雪花图案 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20"
                 style={{
                   clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)"
                 }}
            />
          </motion.div>

          {/* Y字母 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent transform -translate-y-0.5">
              Y
            </span>
          </div>
        </div>

        {/* Logo文字 */}
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Yuki
          </span>
          <span className="text-xs text-gray-500 transform -translate-y-1">
            Tech & Life
          </span>
        </div>

        {/* 装饰点缀 */}
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-blue-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </Link>
  );
};

export default Logo;
