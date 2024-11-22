/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * - 至少8个字符
 * - 至少包含一个数字
 * - 至少包含一个字母
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  return hasNumber && hasLetter;
}

/**
 * 验证用户名格式
 * - 3-30个字符
 * - 只能包含字母、数字、下划线和连字符
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证语言代码格式
 * 例如: en, en-US, zh-CN
 */
export function validateLanguageCode(code: string): boolean {
  const languageCodeRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
  return languageCodeRegex.test(code);
}

/**
 * 验证社交媒体链接
 */
export function validateSocialMediaUrl(url: string, platform: 'twitter' | 'github' | 'linkedin'): boolean {
  if (!validateUrl(url)) return false;

  const platformPatterns = {
    twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
    github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
  };

  return platformPatterns[platform].test(url);
}
