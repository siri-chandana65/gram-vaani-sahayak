
import { useState, useCallback } from 'react';
import { TranslationResponse } from '@/types';

// Mock translation service - In production, integrate with actual translation API
const mockTranslate = async (text: string, from: string, to: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock translations for common phrases
  const translations: Record<string, Record<string, string>> = {
    'hi': {
      'Hello': 'नमस्ते',
      'How can I help you?': 'मैं आपकी कैसे मदद कर सकता हूँ?',
      'Government Services': 'सरकारी सेवाएं',
      'Voice Chat': 'आवाज़ चैट',
      'Settings': 'सेटिंग्स',
      'Thank you': 'धन्यवाद',
    },
    'te': {
      'Hello': 'నమస్కారం',
      'How can I help you?': 'నేను మీకు ఎలా సహాయం చేయగలను?',
      'Government Services': 'ప్రభుత్వ సేవలు',
      'Voice Chat': 'వాయిస్ చాట్',
      'Settings': 'సెట్టింగ్లు',
      'Thank you': 'ధన్యవాదాలు',
    },
    'ta': {
      'Hello': 'வணக்கம்',
      'How can I help you?': 'நான் உங்களுக்கு எப்படி உதவ முடியும்?',
      'Government Services': 'அரசு சேவைகள்',
      'Voice Chat': 'குரல் அரட்டை',
      'Settings': 'அமைப்புகள்',
      'Thank you': 'நன்றி',
    }
  };

  if (to !== 'en' && translations[to] && translations[to][text]) {
    return translations[to][text];
  }

  // For English responses, return as is or mock some responses
  if (to === 'en') {
    return text;
  }

  return `[${to.toUpperCase()}] ${text}`;
};

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (
    text: string, 
    fromLang: string, 
    toLang: string
  ): Promise<TranslationResponse> => {
    setIsTranslating(true);
    
    try {
      const translatedText = await mockTranslate(text, fromLang, toLang);
      
      return {
        translatedText,
        sourceLanguage: fromLang,
        targetLanguage: toLang,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translate,
    isTranslating,
  };
};
