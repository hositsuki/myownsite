import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaWeibo, FaLink } from 'react-icons/fa';

interface ShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  onShare?: (platform: string) => void;
}

export const SocialShare: React.FC<ShareProps> = ({
  url,
  title,
  description = '',
  className = '',
  onShare,
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    weibo: `http://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    onShare?.(platform);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
      onShare?.('copy');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`social-share-container ${className}`}>
      <button
        onClick={() => handleShare('twitter')}
        className="share-button twitter"
        aria-label="分享到 Twitter"
      >
        <FaTwitter />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="share-button facebook"
        aria-label="分享到 Facebook"
      >
        <FaFacebook />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="share-button linkedin"
        aria-label="分享到 LinkedIn"
      >
        <FaLinkedin />
      </button>
      <button
        onClick={() => handleShare('weibo')}
        className="share-button weibo"
        aria-label="分享到微博"
      >
        <FaWeibo />
      </button>
      <button
        onClick={copyToClipboard}
        className="share-button copy"
        aria-label="复制链接"
      >
        <FaLink />
      </button>
    </div>
  );
};
