
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
  originalText?: string;
  audioUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  fontClass: string;
}

export interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: 'documents' | 'utilities' | 'health' | 'education' | 'grievance';
  icon: string;
  url?: string;
  offline?: boolean;
}

export interface UserPreferences {
  language: string;
  location?: {
    state: string;
    district: string;
  };
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
  };
}

export interface ChatSession {
  id: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  language: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}
