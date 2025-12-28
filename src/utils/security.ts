/**
 * Security utilities for input validation and sanitization
 */

// Maximum length limits for various inputs
export const LIMITS = {
  TITLE_MAX_LENGTH: 200,
  CONTENT_MAX_LENGTH: 50000,
  ABSTRACT_MAX_LENGTH: 1000,
  KEYWORDS_MAX_LENGTH: 500,
  PERSONAL_INFO_LABEL_MAX_LENGTH: 50,
  PERSONAL_INFO_VALUE_MAX_LENGTH: 200,
  FOOTNOTE_MAX_LENGTH: 2000,
  CONFIG_NAME_MAX_LENGTH: 100
};

// Regular expressions for validation
export const PATTERNS = {
  FOOTNOTE_REFERENCE: /^\[(\d+)\]$/,
  CHINESE_TEXT: /^[\u4e00-\u9fa5\s\p{P}]*$/u,
  ENGLISH_TEXT: /^[a-zA-Z0-9\s\p{P}]*$/u,
  FILE_NAME: /^[a-zA-Z0-9_\-\.]+$/,
  JSON_STRING: /^[\],:{}\s\n]*$/
};

/**
 * Validates and sanitizes text input
 */
export function sanitizeText(text: string, maxLength: number): string {
  if (typeof text !== 'string') return '';
  
  // Remove potentially dangerous characters
  let sanitized = text
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[\uFFFE\uFFFF]/g, '') // Remove non-characters
    .trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validates footnote references in text
 */
export function validateFootnoteReferences(text: string, footnotes: Array<{ id: number }>): {
  isValid: boolean;
  invalidRefs: number[];
} {
  const matches = text.match(/\[(\d+)\]/g) || [];
  const refs = matches.map(ref => parseInt(ref.slice(1, -1)));
  const validIds = new Set(footnotes.map(f => f.id));
  
  const invalidRefs = refs.filter(id => !validIds.has(id));
  
  return {
    isValid: invalidRefs.length === 0,
    invalidRefs
  };
}

/**
 * Validates JSON configuration
 */
export function validateConfigJSON(jsonString: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    const config = JSON.parse(jsonString);
    
    // Basic structure validation
    if (!config || typeof config !== 'object') {
      return { isValid: false, error: '配置必须是一个对象' };
    }
    
    // Check for required properties
    const requiredSections = ['title', 'personalInfo', 'abstractTitle', 'abstractContent'];
    for (const section of requiredSections) {
      if (!config[section]) {
        return { isValid: false, error: `缺少必需的配置节: ${section}` };
      }
    }
    
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: `JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

/**
 * Validates file type for imports
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Sanitizes filename for download
 */
export function sanitizeFileName(fileName: string): string {
  // Remove or replace dangerous characters
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid filename characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}

/**
 * Validates personal info items
 */
export function validatePersonalInfo(items: Array<{ label?: string; value?: string }>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!Array.isArray(items)) {
    errors.push('个人信息必须是数组');
    return { isValid: false, errors };
  }
  
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`个人信息项 ${index + 1} 格式无效`);
      return;
    }
    
    if (!item.label || typeof item.label !== 'string') {
      errors.push(`个人信息项 ${index + 1} 缺少标签`);
    } else if (item.label.length > LIMITS.PERSONAL_INFO_LABEL_MAX_LENGTH) {
      errors.push(`个人信息项 ${index + 1} 标签过长`);
    }
    
    if (!item.value || typeof item.value !== 'string') {
      errors.push(`个人信息项 ${index + 1} 缺少内容`);
    } else if (item.value.length > LIMITS.PERSONAL_INFO_VALUE_MAX_LENGTH) {
      errors.push(`个人信息项 ${index + 1} 内容过长`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}