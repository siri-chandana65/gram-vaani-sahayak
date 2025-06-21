
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UserPreferences } from '@/types';

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', fontClass: 'font-inter' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', fontClass: 'font-hindi' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', fontClass: 'font-telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', fontClass: 'font-tamil' },
];

// Translation content for the website
const translations = {
  en: {
    // Header & Navigation
    online: 'Online',
    offline: 'Offline',
    
    // Welcome Section
    welcomeTitle: 'Welcome to GramBot',
    welcomeSubtitle: 'Your AI assistant for government services and local support',
    startChat: 'Start Chat',
    voiceChat: 'Voice Chat',
    
    // Services
    governmentServices: 'Government Services',
    
    // Offline
    offlineMode: 'Offline Mode',
    limitedServices: 'Some services may be limited',
    
    // Feedback
    giveFeedback: 'Give Feedback',
    
    // Chat
    aiAssistant: 'AI Assistant',
    listening: 'Listening...',
    speaking: 'Speaking...',
    processing: 'Processing...',
    typeMessage: 'Type your message...',
    voiceNotSupported: 'Voice input not supported',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    location: 'Location',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Welcome message for signed in users
    welcomeUser: 'Welcome, {name}!',
  },
  hi: {
    // Header & Navigation
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    
    // Welcome Section
    welcomeTitle: 'ग्रामबॉट में आपका स्वागत है',
    welcomeSubtitle: 'सरकारी सेवाओं और स्थानीय सहायता के लिए आपका AI सहायक',
    startChat: 'चैट शुरू करें',
    voiceChat: 'वॉयस चैट',
    
    // Services
    governmentServices: 'सरकारी सेवाएं',
    
    // Offline
    offlineMode: 'ऑफ़लाइन मोड',
    limitedServices: 'कुछ सेवाएं सीमित हो सकती हैं',
    
    // Feedback
    giveFeedback: 'फीडबैक दें',
    
    // Chat
    aiAssistant: 'AI सहायक',
    listening: 'सुन रहा हूँ...',
    speaking: 'बोल रहा हूँ...',
    processing: 'प्रोसेसिंग...',
    typeMessage: 'अपना संदेश टाइप करें...',
    voiceNotSupported: 'वॉयस इनपुट समर्थित नहीं है',
    
    // Auth
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    phone: 'फोन नंबर',
    location: 'स्थान',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    
    // Welcome message for signed in users
    welcomeUser: 'स्वागत है, {name}!',
  },
  te: {
    // Header & Navigation
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    
    // Welcome Section
    welcomeTitle: 'గ్రామ్‌బాట్‌కు స్వాగతం',
    welcomeSubtitle: 'ప్రభుత్వ సేవలు మరియు స్థానిక మద్దతు కోసం మీ AI సహాయకుడు',
    startChat: 'చాట్ ప్రారంభించండి',
    voiceChat: 'వాయిస్ చాట్',
    
    // Services
    governmentServices: 'ప్రభుత్వ సేవలు',
    
    // Offline
    offlineMode: 'ఆఫ్‌లైన్ మోడ్',
    limitedServices: 'కొన్ని సేవలు పరిమితం కావచ్చు',
    
    // Feedback
    giveFeedback: 'ఫీడ్‌బ్యాక్ ఇవ్వండి',
    
    // Chat
    aiAssistant: 'AI సహాయకుడు',
    listening: 'వింటున్నాను...',
    speaking: 'మాట్లాడుతున్నాను...',
    processing: 'ప్రాసెసింగ్...',
    typeMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
    voiceNotSupported: 'వాయిస్ ఇన్‌పుట్ మద్దతు లేదు',
    
    // Auth
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    fullName: 'పూర్తి పేరు',
    phone: 'ఫోన్ నంబర్',
    location: 'స్థానం',
    createAccount: 'ఖాతా సృష్టించండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    dontHaveAccount: 'ఖాతా లేదా?',
    
    // Welcome message for signed in users
    welcomeUser: 'స్వాగతం, {name}!',
  },
  ta: {
    // Header & Navigation
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன்',
    
    // Welcome Section
    welcomeTitle: 'கிராம்பாட்டிற்கு வரவேற்கிறோம்',
    welcomeSubtitle: 'அரசு சேவைகள் மற்றும் உள்ளூர் ஆதரவுக்கான உங்கள் AI உதவியாளர்',
    startChat: 'அரட்டையைத் தொடங்கு',
    voiceChat: 'குரல் அரட்டை',
    
    // Services
    governmentServices: 'அரசு சேவைகள்',
    
    // Offline
    offlineMode: 'ஆஃப்லைன் பயன்முறை',
    limitedServices: 'சில சேவைகள் வரையறுக்கப்படலாம்',
    
    // Feedback
    giveFeedback: 'கருத்து தெரிவிக்கவும்',
    
    // Chat
    aiAssistant: 'AI உதவியாளர்',
    listening: 'கேட்டுக்கொண்டிருக்கிறேன்...',
    speaking: 'பேசிக்கொண்டிருக்கிறேன்...',
    processing: 'செயலாக்கம்...',
    typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
    voiceNotSupported: 'குரல் உள்ளீடு ஆதரிக்கப்படவில்லை',
    
    // Auth
    signIn: 'உள்நுழைய',
    signUp: 'பதிவு செய்ய',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    fullName: 'முழு பெயர்',
    phone: 'தொலைபேசி எண்',
    location: 'இடம்',
    createAccount: 'கணக்கை உருவாக்கு',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    
    // Welcome message for signed in users
    welcomeUser: 'வரவேற்கிறோம், {name}!',
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  supportedLanguages: Language[];
  setLanguage: (languageCode: string) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  isLoading: boolean;
  t: (key: string, params?: Record<string, string>) => string;
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

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const langTranslations = translations[currentLanguage.code as keyof typeof translations] || translations.en;
    let translation = langTranslations[key as keyof typeof langTranslations] || key;
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

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
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
