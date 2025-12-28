/**
 * Tests for security utilities
 */

import { 
  sanitizeText, 
  validateFootnoteReferences, 
  validateConfigJSON,
  validateFileType,
  sanitizeFileName,
  validatePersonalInfo,
  LIMITS
} from '../src/utils/security';

// Simple test framework
const tests: Array<{ name: string; fn: () => boolean | void }> = [];

function test(name: string, fn: () => boolean | void) {
  tests.push({ name, fn });
}

function runTests() {
  console.log('Running security utility tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(({ name, fn }) => {
    try {
      let result = fn();
      if (result === false) {
        console.log(`❌ ${name}`);
        failed++;
      } else {
        console.log(`✅ ${name}`);
        passed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error}`);
      failed++;
    }
  });
  
  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Sanitize text tests
test('sanitizeText should remove control characters', () => {
  const input = 'Hello\x00World\x1F';
  const expected = 'HelloWorld';
  return sanitizeText(input, 100) === expected;
});

test('sanitizeText should limit length', () => {
  const input = 'a'.repeat(100);
  const expected = 'a'.repeat(50);
  return sanitizeText(input, 50) === expected;
});

test('sanitizeText should handle non-string input', () => {
  return sanitizeText(null as any, 100) === '' && 
         sanitizeText(undefined as any, 100) === '' &&
         sanitizeText(123 as any, 100) === '';
});

// Validate footnote references tests
test('validateFootnoteReferences should detect valid references', () => {
  const text = 'This is a test [1] with footnote [2]';
  const footnotes = [{ id: 1 }, { id: 2 }];
  const result = validateFootnoteReferences(text, footnotes);
  return result.isValid && result.invalidRefs.length === 0;
});

test('validateFootnoteReferences should detect invalid references', () => {
  const text = 'This is a test [1] with footnote [3]';
  const footnotes = [{ id: 1 }, { id: 2 }];
  const result = validateFootnoteReferences(text, footnotes);
  return !result.isValid && result.invalidRefs.includes(3);
});

// Validate JSON config tests
test('validateConfigJSON should accept valid JSON', () => {
  const json = '{"title": {"family": "宋体"}}';
  const result = validateConfigJSON(json);
  return result.isValid;
});

test('validateConfigJSON should reject invalid JSON', () => {
  const json = '{"title": {"family": "宋体"';
  const result = validateConfigJSON(json);
  return !result.isValid && result.error?.includes('JSON格式错误');
});

test('validateConfigJSON should reject non-object JSON', () => {
  const json = '"not an object"';
  const result = validateConfigJSON(json);
  return !result.isValid && result.error?.includes('必须是一个对象');
});

// Validate personal info tests
test('validatePersonalInfo should accept valid items', () => {
  const items = [
    { label: '姓名', value: '张三' },
    { label: '学号', value: '20230001' }
  ];
  const result = validatePersonalInfo(items);
  return result.isValid && result.errors.length === 0;
});

test('validatePersonalInfo should reject missing label', () => {
  const items = [
    { value: '张三' }
  ];
  const result = validatePersonalInfo(items);
  return !result.isValid && result.errors.some(e => e.includes('缺少标签'));
});

test('validatePersonalInfo should reject too long label', () => {
  const items = [
    { label: 'a'.repeat(LIMITS.PERSONAL_INFO_LABEL_MAX_LENGTH + 1), value: '张三' }
  ];
  const result = validatePersonalInfo(items);
  return !result.isValid && result.errors.some(e => e.includes('标签过长'));
});

// Sanitize filename tests
test('sanitizeFileName should replace invalid characters', () => {
  const input = 'file<>:"/\\|?*name';
  const expected = 'file_________name';
  return sanitizeFileName(input) === expected;
});

test('sanitizeFileName should limit length', () => {
  const input = 'a'.repeat(200);
  const expected = 'a'.repeat(100);
  return sanitizeFileName(input) === expected;
});

// Export for running in browser
if (typeof window !== 'undefined') {
  (window as any).runSecurityTests = runTests;
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}