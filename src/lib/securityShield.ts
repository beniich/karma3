/**
 * Sovereign Front-end Security Shield / Web Application Firewall (WAF)
 * Implements advanced protection against client-side script injection (XSS), 
 * HTML injection, SQL injection payloads, and path traversal strings.
 */

export interface SecurityStatus {
  detected: boolean;
  type: 'XSS' | 'HTML_INJECTION' | 'SQL_INJECTION' | 'PATH_TRAVERSAL' | 'COMMAND_INJECTION' | 'NONE';
  pattern: string;
  payload: string;
  clean: string;
}

// Highly precise cybersecurity signature pattern rules matching common exploitation payloads
const RULES = [
  {
    type: 'XSS' as const,
    name: 'Script Tag Injection',
    regex: /<script[^>]*>[\s\S]*?<\/script>/gi
  },
  {
    type: 'XSS' as const,
    name: 'Inline JavaScript Event Handler',
    // Matches common javascript inline events like onload, onerror, onclick, etc., with arbitrary code/args
    regex: /\b(onmouseover|onload|onerror|onclick|onunload|onfocus|onblur|onchange|onsubmit|onkeydown|onkeypress|onkeyup)\s*=/gi
  },
  {
    type: 'XSS' as const,
    name: 'JavaScript Protocol Link',
    regex: /javascript\s*:\s*/gi
  },
  {
    type: 'HTML_INJECTION' as const,
    name: 'HTML Elements Injection',
    // Matches iframes, embedded elements, raw object modules
    regex: /<(iframe|embed|object|meta|link|style|html|body|applet)[^>]*>/gi
  },
  {
    type: 'SQL_INJECTION' as const,
    name: 'SQL Tautology / Query Manipulation',
    // Matches patterns like ' OR '1'='1' or UNION SELECT
    regex: /(\b(union|select|insert|update|delete|drop|alter|where|and|or)\b\s+.*=.*)|(\b(or|and)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi
  },
  {
    type: 'PATH_TRAVERSAL' as const,
    name: 'Path Traversal File Read',
    regex: /(\.\.\/|\.\.\\)/g
  },
  {
    type: 'COMMAND_INJECTION' as const,
    name: 'System Command Chaining',
    regex: /[;&|]\s*(cat|ls|rm|passwd|sh|bash|npx|node|curl|wget|chmod)\b/gi
  }
];

export function scanInput(input: string): SecurityStatus {
  if (!input || typeof input !== 'string') {
    return { detected: false, type: 'NONE', pattern: '', payload: '', clean: input };
  }

  // Iterate over each security rule
  for (const rule of RULES) {
    if (rule.regex.test(input)) {
      // Find the specific offending block matching the signature
      const match = input.match(rule.regex);
      const offendingBlock = match ? match[0] : input;

      // Create a clean, sanitized value by scrubbing matched patterns
      let clean = input;
      // Reset regex index due to 'g' flag
      rule.regex.lastIndex = 0;
      clean = clean.replace(rule.regex, '[SECURE_SANITISED]');

      return {
        detected: true,
        type: rule.type,
        pattern: rule.name,
        payload: offendingBlock,
        clean: clean
      };
    }
  }

  // If no threat is found, return the input unchanged and clean
  return {
    detected: false,
    type: 'NONE',
    pattern: '',
    payload: '',
    clean: input
  };
}

/**
 * Sanitizes any data object or string recursively to keep components absolutely secure.
 */
export function sanitizeData<T>(data: T): { sanitized: T; attacks: SecurityStatus[] } {
  const attacks: SecurityStatus[] = [];

  const traverseAndSanitize = (val: any): any => {
    if (typeof val === 'string') {
      const result = scanInput(val);
      if (result.detected) {
        attacks.push(result);
        return result.clean;
      }
      return val;
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      const newObj: any = {};
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          newObj[key] = traverseAndSanitize(val[key]);
        }
      }
      return newObj;
    } else if (Array.isArray(val)) {
      return val.map(traverseAndSanitize);
    }
    return val;
  };

  const sanitized = traverseAndSanitize(data);
  return { sanitized, attacks };
}
