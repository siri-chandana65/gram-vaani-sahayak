
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
  const { isListening, isSpeaking, isSupported, startListening, stopListening, speak, stopSpeaking } = useVoice();
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
      ta: "வணக்கம்! நான் உங்கள் AI உதவியாளர். நான் அரசு சேवைகளில் உங்களுக்கு உதவ முடியும், கேள்விகளுக்கு பதில் சொல்ல முடியும், மற்றும் உங்கள் தாய்மொழியில் உதவி செய்ய முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    };
    return welcome[currentLanguage.code as keyof typeof welcome] || welcome.en;
  };

  const generateLocalizedResponse = (text: string, userLanguage: string): string => {
    const lowerText = text.toLowerCase();
    
    // Responses in different languages
    const responses = {
      en: {
        aadhaar: "To apply for an Aadhaar card, you can visit the nearest Aadhaar enrollment center or book an appointment online at uidai.gov.in. You'll need proof of identity, address, and date of birth documents. The process is free of cost.",
        ration: "For a ration card application, contact your local ration card office or apply online through your state's food department website. You'll need family income proof, address proof, and family photographs.",
        health: "For healthcare services, you can apply for Ayushman Bharat health cards for free treatment up to ₹5 lakhs per family per year. Visit your nearest Common Service Center or apply online at beneficiary.nha.gov.in.",
        bill: "You can pay utility bills online through various government portals or mobile apps. Most state electricity boards and water departments have online payment options. You can also use UPI or net banking.",
        scholarship: "For educational scholarships, visit scholarships.gov.in which is the national scholarship portal. You can find various central and state government scholarships based on merit, income, and category.",
        default: "Thank you for your question. I'm here to help you with government services and information. Could you please provide more specific details about what you need assistance with?"
      },
      hi: {
        aadhaar: "आधार कार्ड के लिए आप निकटतम आधार नामांकन केंद्र पर जा सकते हैं या uidai.gov.in पर ऑनलाइन अपॉइंटमेंट बुक कर सकते हैं। आपको पहचान, पता और जन्म तिथि के प्रमाण की जरूरत होगी। यह प्रक्रिया निःशुल्क है।",
        ration: "राशन कार्ड के लिए अपने स्थानीय राशन कार्ड कार्यालय से संपर्क करें या अपने राज्य के खाद्य विभाग की वेबसाइट के माध्यम से ऑनलाइन आवेदन करें। आपको पारिवारिक आय प्रमाण, पता प्रमाण और पारिवारिक फोटो की आवश्यकता होगी।",
        health: "स्वास्थ्य सेवाओं के लिए, आप आयुष्मान भारत स्वास्थ्य कार्ड के लिए आवेदन कर सकते हैं जो प्रति परिवार प्रति वर्ष ₹5 लाख तक का मुफ्त इलाज प्रदान करता है। अपने निकटतम कॉमन सर्विस सेंटर पर जाएं या beneficiary.nha.gov.in पर ऑनलाइन आवेदन करें।",
        bill: "आप विभिन्न सरकारी पोर्टल या मोबाइल ऐप के माध्यम से उपयोगिता बिलों का भुगतान ऑनलाइन कर सकते हैं। अधिकांश राज्य विद्युत बोर्डों और जल विभागों के पास ऑनलाइन भुगतान विकल्प हैं। आप UPI या नेट बैंकिंग का भी उपयोग कर सकते हैं।",
        scholarship: "शैक्षिक छात्रवृत्ति के लिए, scholarships.gov.in पर जाएं जो राष्ट्रीय छात्रवृत्ति पोर्टल है। आप योग्यता, आय और श्रेणी के आधार पर विभिन्न केंद्रीय और राज्य सरकार की छात्रवृत्ति पा सकते हैं।",
        default: "आपके प्रश्न के लिए धन्यवाद। मैं सरकारी सेवाओं और जानकारी में आपकी मदद के लिए यहाँ हूँ। कृपया बताएं कि आपको किस चीज़ में सहायता चाहिए?"
      },
      te: {
        aadhaar: "ఆధార్ కార్డ్ కోసం మీరు సమీప ఆధార్ నమోదు కేంద్రాన్ని సందర్శించవచ్చు లేదా uidai.gov.in వద్ద ఆన్‌లైన్ అపాయింట్‌మెంట్ బుక్ చేసుకోవచ్చు. మీకు గుర్తింపు, చిరునామా మరియు పుట్టిన తేదీ రుజువులు అవసరం. ఈ ప్రక్రియ ఉచితం.",
        ration: "రేషన్ కార్డ్ దరఖాస్తు కోసం, మీ స్థానిక రేషన్ కార్డ్ కార్యాలయాన్ని సంప్రదించండి లేదా మీ రాష్ట్ర ఆహార శాఖ వెబ్‌సైట్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేయండి. మీకు కుటుంబ ఆదాయ రుజువు, చిరునామా రుజువు మరియు కుటుంబ ఫోటోలు అవసరం.",
        health: "ఆరోగ్య సేవల కోసం, మీరు ఆయుష్మాన్ భారత్ ఆరోగ్య కార్డ్‌లకు దరఖాస్తు చేసుకోవచ్చు, ఇది కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత చికిత్స అందిస్తుంది. మీ సమీప కామన్ సర్వీస్ సెంటర్‌ను సందర్శించండి లేదా beneficiary.nha.gov.in వద్ద ఆన్‌లైన్‌లో దరఖాస్తు చేయండి.",
        bill: "మీరు వివిధ ప్రభుత్వ పోర్టల్‌లు లేదా మొబైల్ యాప్‌ల ద్వారా యుటిలిటీ బిల్లులను ఆన్‌లైన్‌లో చెల్లించవచ్చు. చాలా రాష్ట్ర విద్యుత్ బోర్డులు మరియు నీటి శాఖలు ఆన్‌లైన్ చెల్లింపు ఎంపికలను కలిగి ఉన్నాయి. మీరు UPI లేదా నెట్ బ్యాంకింగ్‌ను కూడా ఉపయోగించవచ్చు.",
        scholarship: "విద్యా స్కాలర్‌షిప్‌ల కోసం, జాతీయ స్కాలర్‌షిప్ పోర్టల్ అయిన scholarships.gov.in ను సందర్శించండి. మీరు మెరిట్, ఆదాయం మరియు వర్గం ఆధారంగా వివిధ కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ స్కాలర్‌షిప్‌లను కనుగొనవచ్చు.",
        default: "మీ ప్రశ్నకు ధన్యవాదాలు. నేను ప్రభుత్వ సేవలు మరియు సమాచారంతో మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీకు ఏమిలో సహాయం కావాలో దయచేసి మరింత వివరంగా చెప్పగలరా?"
      },
      ta: {
        aadhaar: "ஆதார் கார்டுக்கு நீங்கள் அருகிலுள்ள ஆதார் பதிவு மையத்தை பார்வையிடலாம் அல்லது uidai.gov.in இல் ஆன்லைன் அப்பாயின்ட்மென்ட் முன்பதிவு செய்யலாம். உங்களுக்கு அடையாள, முகவரி மற்றும் பிறந்த தேதி ஆதாரங்கள் தேவைப்படும். இந்த செயல்முறை இலவசம்.",
        ration: "ரேஷன் கார்டு விண்ணப்பத்திற்கு, உங்கள் உள்ளூர் ரேஷன் கார்டு அலுவலகத்தை தொடர்பு கொள்ளுங்கள் அல்லது உங்கள் மாநில உணவு துறையின் வலைத்தளம் மூலம் ஆன்லைனில் விண்ணப்பிக்கவும். உங்களுக்கு குடும்ப வருமான ஆதாரம், முகவரி ஆதாரம் மற்றும் குடும்ப புகைப்படங்கள் தேவைப்படும்.",
        health: "சுகாதார சேவைகளுக்கு, நீங்கள் ஆயுஷ்மான் பாரத் சுகாதார அட்டைகளுக்கு விண்ணப்பிக்கலாம், இது குடும்பத்திற்கு வருடத்திற்கு ₹5 லட்சம் வரை இலவச சிகிச்சையை வழங்குகிறது. உங்கள் அருகிலுள்ள காமன் சர்வீஸ் சென்டரை பார்வையிடுங்கள் அல்லது beneficiary.nha.gov.in இல் ஆன்லைனில் விண்ணப்பிக்கவும்.",
        bill: "நீங்கள் பல்வேறு அரசு போர்ட்டல்கள் அல்லது மொபைல் ஆப்ஸ் மூலம் பயன்பாட்டு கட்டணங்களை ஆன்லைனில் செலுத்தலாம். பெரும்பாலான மாநில மின்சார வாரியங்கள் மற்றும் நீர் துறைகள் ஆன்லைன் கட்டண விருப்பங்களை கொண்டுள்ளன. நீங்கள் UPI அல்லது நெட் பேங்கிங்கையும் பயன்படுத்தலாம்.",
        scholarship: "கல்வி உதவித்தொகைகளுக்கு, தேசிய உதவித்தொகை போர்ட்டலான scholarships.gov.in ஐ பார்வையிடுங்கள். நீங்கள் தகுதி, வருமானம் மற்றும் வகையின் அடிப்படையில் பல்வேறு மத்திய மற்றும் மாநில அரசு உதவித்தொகைகளை காணலாம்.",
        default: "உங்கள் கேள்விக்கு நன்றி. நான் அரசு சேவைகள் மற்றும் தகவல்களில் உங்களுக்கு உதவ இங்கே இருக்கிறேன். உங்களுக்கு எதில் உதவி தேவை என்பதை தயவுசெய்து மேலும் விரிவாக சொல்ல முடியுமா?"
      }
    };

    // Get appropriate response based on keywords and language
    const langResponses = responses[userLanguage as keyof typeof responses] || responses.en;
    
    if (lowerText.includes('aadhaar') || lowerText.includes('aadhar') || lowerText.includes('आधार') || lowerText.includes('ఆధార్') || lowerText.includes('ஆதார்')) {
      return langResponses.aadhaar;
    }
    if (lowerText.includes('ration') || lowerText.includes('राशन') || lowerText.includes('రేషన్') || lowerText.includes('ரேஷன்')) {
      return langResponses.ration;
    }
    if (lowerText.includes('health') || lowerText.includes('स्वास्थ्य') || lowerText.includes('ఆరోగ్యం') || lowerText.includes('சுகாதார')) {
      return langResponses.health;
    }
    if (lowerText.includes('bill') || lowerText.includes('बिल') || lowerText.includes('బిల్లు') || lowerText.includes('கட்டணம்')) {
      return langResponses.bill;
    }
    if (lowerText.includes('scholarship') || lowerText.includes('छात्रवृत्ति') || lowerText.includes('స్కాలర్‌షిప్') || lowerText.includes('உதவித்தொகை')) {
      return langResponses.scholarship;
    }
    
    return langResponses.default;
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
      // Generate response in the same language as user input
      const aiResponseText = generateLocalizedResponse(text.trim(), currentLanguage.code);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage.code,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
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
                 currentLanguage.code === 'ta' ? 'AI உதவியாळர்' :
                 'AI Assistant'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isListening ? (
                  currentLanguage.code === 'hi' ? 'सुन रहा हूँ...' :
                  currentLanguage.code === 'te' ? 'వింటున్నాను...' :
                  currentLanguage.code === 'ta' ? 'கேट்டுक्कொण्डिरुक्किறेन्...' :
                  'Listening...'
                ) : isSpeaking ? (
                  currentLanguage.code === 'hi' ? 'बोल रहा हूँ...' :
                  currentLanguage.code === 'te' ? 'మాట్లాడుతున్నాను...' :
                  currentLanguage.code === 'ta' ? 'पेसिक्कोण्डिरुक्किறेन्...' :
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
                       currentLanguage.code === 'ta' ? 'செயలाक्कम्...' :
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
                    currentLanguage.code === 'ta' ? 'उमगळ् सेय्तियै तट्टच्चु सेय्युंगळ्...' :
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
                 currentLanguage.code === 'ta' ? 'कुरळ् उळ्ळीडु आतरिक्कप्पडवில्लै' :
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
