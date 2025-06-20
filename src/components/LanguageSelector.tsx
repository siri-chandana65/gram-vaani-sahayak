
import React from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const { currentLanguage, supportedLanguages, setLanguage } = useLanguage();

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode);
    onClose();
  };

  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        variant="outline"
        className="flex items-center gap-2 h-12 px-4 text-base touch-target"
      >
        <Globe className="h-5 w-5" />
        <span className={cn('font-medium', currentLanguage.fontClass)}>
          {currentLanguage.nativeName}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', {
          'rotate-180': isOpen
        })} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <Card className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto z-50 p-2">
            <div className="space-y-1">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors touch-target',
                    'hover:bg-muted focus:bg-muted focus:outline-none',
                    language.fontClass,
                    {
                      'bg-primary/10 text-primary': currentLanguage.code === language.code,
                    }
                  )}
                >
                  <div>
                    <div className="font-medium text-base">
                      {language.nativeName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language.name}
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
