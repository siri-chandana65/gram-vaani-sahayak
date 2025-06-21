
import React from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword } from '@/utils/validation';
import { cn } from '@/lib/utils';

interface PasswordValidationProps {
  password: string;
  className?: string;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({ 
  password, 
  className 
}) => {
  const validation = validatePassword(password);
  
  const rules = [
    { key: 'length', text: 'At least 8 characters long', test: password.length >= 8 },
    { key: 'lowercase', text: 'One lowercase letter', test: /[a-z]/.test(password) },
    { key: 'uppercase', text: 'One uppercase letter', test: /[A-Z]/.test(password) },
    { key: 'number', text: 'One number', test: /\d/.test(password) },
    { key: 'special', text: 'One special character', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  // Don't show validation if password is empty or all rules are met
  if (!password || validation.isValid) {
    return null;
  }

  return (
    <div className={cn('mt-2 space-y-1', className)}>
      {rules.map((rule) => (
        <div key={rule.key} className="flex items-center gap-2 text-xs">
          {rule.test ? (
            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
          ) : (
            <X className="h-3 w-3 text-red-500 flex-shrink-0" />
          )}
          <span className={cn(
            'transition-colors',
            rule.test ? 'text-green-600' : 'text-red-600'
          )}>
            {rule.text}
          </span>
        </div>
      ))}
    </div>
  );
};
