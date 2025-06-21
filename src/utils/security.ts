
// Security utility functions

export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const sanitizeForDisplay = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const logSecurityEvent = (event: string, details?: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details: details || {},
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  console.warn('Security Event:', logEntry);
  
  // In production, you would send this to your security monitoring service
  // Example: sendToSecurityService(logEntry);
};

export const isValidServiceType = (serviceType: string): boolean => {
  const validServiceTypes = [
    'aadhaar', 'pan-card', 'passport', 'ration-card',
    'electricity-bill', 'water-bill', 'gas-connection', 'property-tax',
    'health-card', 'vaccination', 'health-insurance', 'medical-certificate',
    'scholarship', 'school-admission', 'mid-day-meal', 'student-loan',
    'pgms', 'police-complaint', 'consumer-complaint'
  ];
  
  return validServiceTypes.includes(serviceType);
};

export const rateLimitCheck = (key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean => {
  const now = Date.now();
  const windowKey = `${key}_${Math.floor(now / windowMs)}`;
  
  const attempts = parseInt(localStorage.getItem(windowKey) || '0');
  
  if (attempts >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  localStorage.setItem(windowKey, (attempts + 1).toString());
  
  // Clean up old entries
  const oneHourAgo = now - 3600000;
  Object.keys(localStorage).forEach(storageKey => {
    if (storageKey.startsWith(key) && storageKey !== windowKey) {
      const timestamp = parseInt(storageKey.split('_').pop() || '0') * windowMs;
      if (timestamp < oneHourAgo) {
        localStorage.removeItem(storageKey);
      }
    }
  });
  
  return true; // Within rate limit
};
