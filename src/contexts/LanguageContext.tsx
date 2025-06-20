
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UserPreferences } from '@/types';

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', fontClass: 'font-inter' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', fontClass: 'font-hindi' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', fontClass: 'font-telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', fontClass: 'font-tamil' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', fontClass: 'font-inter' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', fontClass: 'font-inter' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', fontClass: 'font-inter' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', fontClass: 'font-hindi' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', fontClass: 'font-inter' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', fontClass: 'font-inter' },
];

interface LanguageContextType {
  currentLanguage: Language;
  supportedLanguages: Language[];
  setLanguage: (languageCode: string) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    voiceSettings: {
      rate: 1,
      pitch: 1,
      volume: 1,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const loadPreferences = () => {
      try {
        const savedPrefs = localStorage.getItem('vernacular-ai-preferences');
        if (savedPrefs) {
          const parsed = JSON.parse(savedPrefs);
          setPreferences(parsed);
          const lang = SUPPORTED_LANGUAGES.find(l => l.code === parsed.language);
          if (lang) {
            setCurrentLanguage(lang);
          }
        } else {
          // Auto-detect language from browser
          const browserLang = navigator.language.split('-')[0];
          const detectedLang = SUPPORTED_LANGUAGES.find(l => l.code === browserLang);
          if (detectedLang) {
            setCurrentLanguage(detectedLang);
            setPreferences(prev => ({ ...prev, language: detectedLang.code }));
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const setLanguage = (languageCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      updatePreferences({ language: languageCode });
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...prefs };
    setPreferences(newPrefs);
    localStorage.setItem('vernacular-ai-preferences', JSON.stringify(newPrefs));
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
        preferences,
        updatePreferences,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
