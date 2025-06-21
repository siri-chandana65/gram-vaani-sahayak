
import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VoiceSettings } from '@/types';

export const useVoice = () => {
  const { currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check browser support
    const speechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    setIsSupported(!!speechRecognition && !!window.speechSynthesis);

    if (speechRecognition) {
      recognitionRef.current = new speechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }

    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const getLanguageCode = (langCode: string) => {
    const languageMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN',
      'bn': 'bn-IN'
    };
    return languageMap[langCode] || 'en-IN';
  };

  const startListening = useCallback((
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.lang = getLanguageCode(currentLanguage.code);

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError?.('Failed to start voice recognition');
      setIsListening(false);
    }
  }, [currentLanguage.code, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const findBestVoice = useCallback((language: string) => {
    if (!synthRef.current) return null;

    const voices = synthRef.current.getVoices();
    const langCode = getLanguageCode(language);
    
    // Priority order: exact language match > language family match > fallback
    const priorities = [
      (voice: SpeechSynthesisVoice) => voice.lang === langCode,
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith(language),
      (voice: SpeechSynthesisVoice) => voice.lang.includes('IN'), // Indian voices
      (voice: SpeechSynthesisVoice) => voice.default // Default system voice
    ];

    for (const priority of priorities) {
      const voice = voices.find(priority);
      if (voice) return voice;
    }

    return voices[0] || null;
  }, []);

  const speak = useCallback((text: string, settings?: Partial<VoiceSettings>) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language and find appropriate voice
    utterance.lang = getLanguageCode(currentLanguage.code);
    const bestVoice = findBestVoice(currentLanguage.code);
    
    if (bestVoice) {
      utterance.voice = bestVoice;
      console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang}) for language: ${currentLanguage.code}`);
    }

    // Adjust speech settings for better regional pronunciation
    utterance.rate = settings?.rate ?? (currentLanguage.code === 'en' ? 0.9 : 0.8);
    utterance.pitch = settings?.pitch ?? 1;
    utterance.volume = settings?.volume ?? 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    // Wait for voices to be loaded before speaking
    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.onvoiceschanged = () => {
        const voice = findBestVoice(currentLanguage.code);
        if (voice) utterance.voice = voice;
        synthRef.current?.speak(utterance);
      };
    } else {
      synthRef.current.speak(utterance);
    }
  }, [currentLanguage.code, findBestVoice]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
};
