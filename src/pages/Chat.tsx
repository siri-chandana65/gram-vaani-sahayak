
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VoiceButton } from '@/components/VoiceButton';
import { ChatMessage } from '@/components/ChatMessage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/hooks/useVoice';
import { useTranslation } from '@/hooks/useTranslation';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { currentLanguage } = useLanguage();
  const { isListening, isSpeaking, isSupported, startListening, stopListening, speak } = useVoice();
  const { translate, isTranslating } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date(),
      language: currentLanguage.code,
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message
    setTimeout(() => {
      speak(welcomeMessage.text);
    }, 500);
  }, [currentLanguage.code]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = () => {
    const welcome = {
      en: "Hello! I'm your AI assistant. I can help you with government services, answer questions, and assist in your native language. How can I help you today?",
      hi: "नमस्ते! मैं आपका AI सहायक हूँ। मैं सरकारी सेवाओं में आपकी मदद कर सकता हूँ, सवालों के जवाब दे सकता हूँ, और आपकी मातृभाषा में सहायता कर सकता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      te: "నమస్కారం! నేను మీ AI సహాయకుడిని. నేను ప్రభుత్వ సేవలతో మీకు సహాయం చేయగలను, ప్రశ్నలకు సమాధానాలు ఇవ్వగలను, మరియు మీ మాతృభాషలో సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      ta: "வணக்கம்! நான் உங்கள் AI உதவியாளர். நான் அரசு சேவைகளில் உங்களுக்கு உதவ முடியும், கேள்விகளுக்கு பதில் சொல்ல முடியும், மற்றும் உங்கள் தாய்மொழியில் உதவி செய்ய முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    };
    return welcome[currentLanguage.code as keyof typeof welcome] || welcome.en;
  };

  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      language: currentLanguage.code,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      // Simulate AI processing with translation
      let processedText = text.trim();
      
      // If not in English, translate to English for processing
      if (currentLanguage.code !== 'en') {
        const translation = await translate(processedText, currentLanguage.code, 'en');
        processedText = translation.translatedText;
      }

      // Generate AI response (mock)
      const aiResponseText = generateAIResponse(processedText);
      
      // Translate back to user's language if needed
      let finalResponse = aiResponseText;
      if (currentLanguage.code !== 'en') {
        const translation = await translate(aiResponseText, 'en', currentLanguage.code);
        finalResponse = translation.translatedText;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: finalResponse,
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage.code,
        originalText: currentLanguage.code !== 'en' ? aiResponseText : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
      setTimeout(() => {
        speak(finalResponse);
      }, 300);

    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = (text: string): string => {
    // Mock AI responses based on keywords
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('aadhaar') || lowerText.includes('aadhar')) {
      return "To apply for an Aadhaar card, you can visit the nearest Aadhaar enrollment center or book an appointment online at uidai.gov.in. You'll need proof of identity, address, and date of birth documents. The process is free of cost.";
    }
    
    if (lowerText.includes('ration') || lowerText.includes('food')) {
      return "For a ration card application, contact your local ration card office or apply online through your state's food department website. You'll need family income proof, address proof, and family photographs.";
    }
    
    if (lowerText.includes('health') || lowerText.includes('hospital')) {
      return "For healthcare services, you can apply for Ayushman Bharat health cards for free treatment up to ₹5 lakhs per family per year. Visit your nearest Common Service Center or apply online at beneficiary.nha.gov.in.";
    }
    
    if (lowerText.includes('bill') || lowerText.includes('payment')) {
      return "You can pay utility bills online through various government portals or mobile apps. Most state electricity boards and water departments have online payment options. You can also use UPI or net banking.";
    }
    
    if (lowerText.includes('scholarship') || lowerText.includes('education')) {
      return "For educational scholarships, visit scholarships.gov.in which is the national scholarship portal. You can find various central and state government scholarships based on merit, income, and category.";
    }
    
    // Default response
    return "Thank you for your question. I'm here to help you with government services and information. Could you please provide more specific details about what you need assistance with?";
  };

  const handleVoiceStart = () => {
    if (!isSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    startListening(
      (transcript) => {
        console.log('Voice input received:', transcript);
        handleSendMessage(transcript, true);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        toast({
          title: "Voice Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className={cn('text-lg font-bold', currentLanguage.fontClass)}>
                {currentLanguage.code === 'hi' ? 'AI सहायक' :
                 currentLanguage.code === 'te' ? 'AI సహాయకుడు' :
                 currentLanguage.code === 'ta' ? 'AI உதவியாளர்' :
                 'AI Assistant'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isListening ? (
                  currentLanguage.code === 'hi' ? 'सुन रहा हूँ...' :
                  currentLanguage.code === 'te' ? 'వింటున్నాను...' :
                  currentLanguage.code === 'ta' ? 'கேட்டுக்கொண்டிருக்கிறேன்...' :
                  'Listening...'
                ) : isSpeaking ? (
                  currentLanguage.code === 'hi' ? 'बोल रहा हूँ...' :
                  currentLanguage.code === 'te' ? 'మాట్లాడుతున్నాను...' :
                  currentLanguage.code === 'ta' ? 'பேசிக்கொண்டிருக்கிறேன்...' :
                  'Speaking...'
                ) : (
                  currentLanguage.code === 'hi' ? 'ऑनलाइन' :
                  currentLanguage.code === 'te' ? 'ఆన్‌లైన్' :
                  currentLanguage.code === 'ta' ? 'ஆன்லைன்' :
                  'Online'
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {(isProcessing || isTranslating) && (
              <div className="flex justify-center">
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className={cn('text-sm', currentLanguage.fontClass)}>
                      {currentLanguage.code === 'hi' ? 'प्रोसेसिंग...' :
                       currentLanguage.code === 'te' ? 'ప్రాసెసింగ్...' :
                       currentLanguage.code === 'ta' ? 'செயலாக்கம்...' :
                       'Processing...'}
                    </span>
                  </div>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    currentLanguage.code === 'hi' ? 'अपना संदेश टाइप करें...' :
                    currentLanguage.code === 'te' ? 'మీ సందేశాన్ని టైప్ చేయండి...' :
                    currentLanguage.code === 'ta' ? 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...' :
                    'Type your message...'
                  }
                  className={cn('pr-12 h-12 text-base', currentLanguage.fontClass)}
                  disabled={isProcessing || isListening}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim() || isProcessing || isListening}
                  className="absolute right-1 top-1 h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                onStartListening={handleVoiceStart}
                onStopListening={stopListening}
                disabled={isProcessing || !isSupported}
              />
            </form>
            
            {!isSupported && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {currentLanguage.code === 'hi' ? 'वॉयस इनपुट समर्थित नहीं है' :
                 currentLanguage.code === 'te' ? 'వాయిస్ ఇన్‌పుట్ మద్దతు లేదు' :
                 currentLanguage.code === 'ta' ? 'குரல் உள்ளீடு ஆதரிக்கப்படவில்லை' :
                 'Voice input not supported'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
