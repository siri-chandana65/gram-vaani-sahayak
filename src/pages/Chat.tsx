
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
  const { currentLanguage, t } = useLanguage();
  const { isListening, isSpeaking, isSupported, startListening, stopListening, speak, stopSpeaking } = useVoice();
  const { translate, isTranslating } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

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

  // Cleanup voice when component unmounts or page changes
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

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

  const generateContextualResponse = (text: string, userLanguage: string, context: string[]): string => {
    const lowerText = text.toLowerCase();
    
    // Enhanced responses with context awareness
    const responses = {
      en: {
        greeting: [
          "Hello! I'm here to help you with government services and information. What would you like to know?",
          "Hi there! I can assist you with various government schemes and services. How can I help today?",
          "Welcome! I'm your AI assistant for government services. What information are you looking for?"
        ],
        aadhaar: [
          "To apply for an Aadhaar card, visit your nearest Aadhaar enrollment center or book an appointment online at uidai.gov.in. You'll need proof of identity, address, and date of birth documents. The process is completely free.",
          "For Aadhaar services, you can also update your details online, download your e-Aadhaar, or check your enrollment status. Is there a specific Aadhaar service you need help with?",
          "Aadhaar is mandatory for many government services. If you need to link it with your bank account or mobile number, I can guide you through that process too."
        ],
        ration: [
          "For a ration card application, contact your local ration card office or apply online through your state's food department website. You'll need family income proof, address proof, and family photographs.",
          "Ration cards are issued based on income categories: APL (Above Poverty Line), BPL (Below Poverty Line), and AAY (Antyodaya Anna Yojana). Which category would you like to know about?",
          "Once you have a ration card, you can purchase subsidized food grains from Fair Price Shops (FPS) in your area. Would you like to know about the current food grain prices?"
        ],
        health: [
          "For healthcare services, you can apply for Ayushman Bharat health cards for free treatment up to ₹5 lakhs per family per year. Visit your nearest Common Service Center or apply online at beneficiary.nha.gov.in.",
          "The Ayushman Bharat scheme covers over 1,400 medical procedures including surgeries, medical treatments, and day care procedures. Are you looking for information about a specific medical condition?",
          "Apart from Ayushman Bharat, there are state-specific health insurance schemes. Which state are you from? I can provide information about local health programs."
        ],
        bill: [
          "You can pay utility bills online through various government portals, mobile apps, or UPI. Most state electricity boards and water departments have their own online payment systems.",
          "For electricity bills, you can also set up autopay or use apps like BHIM, Paytm, or your bank's mobile app. Would you like help finding your state's electricity board website?",
          "Water bills can usually be paid through your municipal corporation's website or app. Some areas also accept payments through WhatsApp banking services."
        ],
        scholarship: [
          "For educational scholarships, visit scholarships.gov.in which is the national scholarship portal. You can find various central and state government scholarships based on merit, income, and category.",
          "Scholarships are available for different education levels - from school to post-graduation. What level of education are you seeking scholarship for?",
          "The application process usually opens in July-August for the next academic year. Documents typically required include income certificate, caste certificate (if applicable), and academic records."
        ],
        default: [
          "I'm here to help you with government services and information. Could you please provide more specific details about what you need assistance with?",
          "I can help you with Aadhaar, PAN card, ration card, health insurance, scholarships, and many other government services. What specific information do you need?",
          "Feel free to ask me about any government scheme, document application, or public service. I'm here to guide you through the process."
        ]
      },
      hi: {
        greeting: [
          "नमस्ते! मैं सरकारी सेवाओं और जानकारी में आपकी मदद के लिए यहाँ हूँ। आप क्या जानना चाहते हैं?",
          "नमस्कार! मैं विभिन्न सरकारी योजनाओं और सेवाओं में आपकी सहायता कर सकता हूँ। आज मैं कैसे मदद कर सकता हूँ?",
          "स्वागत है! मैं सरकारी सेवाओं के लिए आपका AI सहायक हूँ। आप कौन सी जानकारी खोज रहे हैं?"
        ],
        aadhaar: [
          "आधार कार्ड के लिए आप निकटतम आधार नामांकन केंद्र पर जा सकते हैं या uidai.gov.in पर ऑनलाइन अपॉइंटमेंट बुक कर सकते हैं। आपको पहचान, पता और जन्म तिथि के प्रमाण की जरूरत होगी। यह प्रक्रिया पूरी तरह मुफ्त है।",
          "आधार सेवाओं के लिए, आप अपनी जानकारी ऑनलाइन अपडेट कर सकते हैं, अपना ई-आधार डाउनलोड कर सकते हैं, या अपनी नामांकन स्थिति की जांच कर सकते हैं। क्या कोई विशिष्ट आधार सेवा है जिसमें आपको मदद चाहिए?",
          "आधार कई सरकारी सेवाओं के लिए अनिवार्य है। यदि आपको इसे अपने बैंक खाते या मोबाइल नंबर से लिंक करना है, तो मैं आपको इस प्रक्रिया के बारे में बता सकता हूँ।"
        ],
        default: [
          "मैं सरकारी सेवाओं और जानकारी में आपकी मदद के लिए यहाँ हूँ। कृपया बताएं कि आपको किस चीज़ में सहायता चाहिए?",
          "मैं आधार, पैन कार्ड, राशन कार्ड, स्वास्थ्य बीमा, छात्रवृत्ति और कई अन्य सरकारी सेवाओं में आपकी मदद कर सकता हूँ। आपको कौन सी विशिष्ट जानकारी चाहिए?",
          "किसी भी सरकारी योजना, दस्तावेज़ आवेदन, या सार्वजनिक सेवा के बारे में मुझसे पूछने में संकोच न करें। मैं आपको प्रक्रिया के बारे में बताने के लिए यहाँ हूँ।"
        ]
      },
      te: {
        greeting: [
          "నమస్కారం! నేను ప్రభుత్వ సేవలు మరియు సమాచారంతో మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
          "హలో! నేను వివిధ ప్రభుత్వ పథకాలు మరియు సేవలతో మీకు సహాయం చేయగలను. ఈరోజు నేను ఎలా సహాయం చేయగలను?",
          "స్వాగతం! నేను ప్రభుత్వ సేవల కోసం మీ AI సహాయకుడిని. మీరు ఏ సమాచారం కోసం చూస్తున్నారు?"
        ],
        default: [
          "నేను ప్రభుత్వ సేవలు మరియు సమాచారంతో మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీకు ఏమిలో సహాయం కావాలో దయచేసి మరింత వివరంగా చెప్పగలరా?",
          "నేను ఆధార్, పాన్ కార్డ్, రేషన్ కార్డ్, ఆరోగ్య బీమా, స్కాలర్‌షిప్‌లు మరియు అనేక ఇతర ప్రభుత్వ సేవలతో మీకు సహాయం చేయగలను. మీకు ఏ నిర్దిష్ట సమాచారం అవసరం?",
          "ఏదైనా ప్రభుత్వ పథకం, పత్రం దరఖాస్తు లేదా ప్రజా సేవ గురించి నన్ను అడగడానికి సంకోచించకండి. నేను మీకు ప్రక్రియ గురించి మార్గదర్శనం చేయడానికి ఇక్కడ ఉన్నాను।"
        ]
      },
      ta: {
        greeting: [
          "வணக்கம்! நான் அரசு சேவைகள் மற்றும் தகவல்களில் உங்களுக்கு உதவ இங்கே இருக்கிறேன். நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
          "வணக்கம்! நான் பல்வேறு அரசு திட்டங்கள் மற்றும் சேவைகளில் உங்களுக்கு உதவ முடியும். இன்று நான் எப்படி உதவ முடியும்?",
          "வரவேற்கிறோம்! நான் அரசு சேவைகளுக்கான உங்கள் AI உதவியாளர். நீங்கள் எந்த தகவலைத் தேடுகிறீர்கள்?"
        ],
        default: [
          "நான் அரசு சேவைகள் மற்றும் தகவல்களில் உங்களுக்கு உதவ இங்கே இருக்கிறேன். உங்களுக்கு எந்த விஷயத்தில் உதவி தேவை என்பதை தயவுசெய்து மேலும் விவரமாக சொல்ல முடியுமா?",
          "நான் ஆதார், பான் கார்டு, ரேஷன் கார்டு, சுகாதார காப்பீடு, உதவித்தொகை மற்றும் பல அரசு சேவைகளில் உங்களுக்கு உதவ முடியும். உங்களுக்கு என்ன குறிப்பிட்ட தகவல் தேவை?",
          "எந்த அரசு திட்டம், ஆவண விண்ணப்பம் அல்லது பொது சேவை பற்றி என்னிடம் கேட்க தயங்க வேண்டாம். செயல்முறை குறித்து உங்களுக்கு வழிகாட்ட நான் இங்கே இருக்கிறேன்."
        ]
      }
    };

    // Get appropriate response based on keywords and language
    const langResponses = responses[userLanguage as keyof typeof responses] || responses.en;
    
    // Determine response category based on keywords
    let category = 'default';
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('नमस्ते') || lowerText.includes('నమస్కారం') || lowerText.includes('வணக்கம்')) {
      category = 'greeting';
    } else if (lowerText.includes('aadhaar') || lowerText.includes('aadhar') || lowerText.includes('आधार') || lowerText.includes('ఆధార్') || lowerText.includes('ஆதார்')) {
      category = 'aadhaar';
    } else if (lowerText.includes('ration') || lowerText.includes('राशन') || lowerText.includes('రేషన్') || lowerText.includes('ரேஷன்')) {
      category = 'ration';
    } else if (lowerText.includes('health') || lowerText.includes('स्वास्थ्य') || lowerText.includes('ఆరోగ్యం') || lowerText.includes('சுகாதார')) {
      category = 'health';
    } else if (lowerText.includes('bill') || lowerText.includes('बिल') || lowerText.includes('బில్లు') || lowerText.includes('கட்டணம்')) {
      category = 'bill';
    } else if (lowerText.includes('scholarship') || lowerText.includes('छात्रवृत्ति') || lowerText.includes('స్కాలర్‌షిప్') || lowerText.includes('உதவித்தொகை')) {
      category = 'scholarship';
    }
    
    // Get responses for the category or use default
    const categoryResponses = langResponses[category] || langResponses.default;
    
    // Select response based on context to avoid repetition
    const contextIndex = context.length % categoryResponses.length;
    return categoryResponses[contextIndex];
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

    // Add to conversation context
    const newContext = [...conversationContext, text.trim()].slice(-5); // Keep last 5 messages for context
    setConversationContext(newContext);

    try {
      // Generate contextual response in the same language as user input
      const aiResponseText = generateContextualResponse(text.trim(), currentLanguage.code, newContext);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage.code,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response in the user's language
      setTimeout(() => {
        speak(aiResponseText);
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
    // Stop all voice activities before navigating back
    stopListening();
    stopSpeaking();
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="h-8 w-8 sm:h-10 sm:w-10 p-0 touch-target"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex-1">
              <h1 className={cn('text-base sm:text-lg lg:text-xl font-bold', currentLanguage.fontClass)}>
                {t('aiAssistant')}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isListening ? t('listening') : isSpeaking ? t('speaking') : t('online')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {(isProcessing || isTranslating) && (
              <div className="flex justify-center">
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className={cn('text-sm', currentLanguage.fontClass)}>
                      {t('processing')}
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
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('typeMessage')}
                  className={cn('pr-10 sm:pr-12 h-10 sm:h-12 lg:h-14 text-sm sm:text-base touch-target', currentLanguage.fontClass)}
                  disabled={isProcessing || isListening}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim() || isProcessing || isListening}
                  className="absolute right-1 top-1 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 p-0 touch-target"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </Button>
              </div>
              
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                onStartListening={handleVoiceStart}
                onStopListening={stopListening}
                disabled={isProcessing || !isSupported}
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              />
            </form>
            
            {!isSupported && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('voiceNotSupported')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
