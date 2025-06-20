
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

  const startListening = useCallback((
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.lang = currentLanguage.code === 'en' ? 'en-IN' : 
                                   currentLanguage.code === 'hi' ? 'hi-IN' :
                                   currentLanguage.code === 'te' ? 'te-IN' :
                                   currentLanguage.code === 'ta' ? 'ta-IN' :
                                   'en-IN';

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

  const speak = useCallback((text: string, settings?: Partial<VoiceSettings>) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language-specific voice
    const voices = synthRef.current.getVoices();
    const languageVoice = voices.find(voice => 
      voice.lang.startsWith(currentLanguage.code) ||
      (currentLanguage.code === 'hi' && voice.lang.includes('hi')) ||
      (currentLanguage.code === 'te' && voice.lang.includes('te')) ||
      (currentLanguage.code === 'ta' && voice.lang.includes('ta'))
    );

    if (languageVoice) {
      utterance.voice = languageVoice;
    }

    utterance.lang = currentLanguage.code === 'en' ? 'en-IN' : 
                    currentLanguage.code === 'hi' ? 'hi-IN' :
                    currentLanguage.code === 'te' ? 'te-IN' :
                    currentLanguage.code === 'ta' ? 'ta-IN' :
                    'en-IN';

    utterance.rate = settings?.rate ?? 0.9;
    utterance.pitch = settings?.pitch ?? 1;
    utterance.volume = settings?.volume ?? 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [currentLanguage.code]);

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
