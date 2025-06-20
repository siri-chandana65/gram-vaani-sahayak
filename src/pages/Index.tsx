
import React, { useState, useEffect } from 'react';
import { MessageCircle, Settings, FileText, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { GOVERNMENT_SERVICES } from '@/data/governmentServices';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { currentLanguage, isLoading } = useLanguage();
  const { toast } = useToast();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleChatClick = () => {
    // Navigate to chat interface (will be implemented with routing)
    window.location.hash = '#/chat';
  };

  const handleServiceClick = (serviceId: string) => {
    toast({
      title: "Service Information",
      description: "This service integration is coming soon!",
    });
  };

  const getGreeting = () => {
    const greetings = {
      en: "Welcome to Vernacular AI",
      hi: "वर्नाक्यूलर एआई में आपका स्वागत है",
      te: "వర్నాక్యులర్ AI కు స్వాగతం",
      ta: "வர்னாக்குலர் AI க்கு வரவேற்கிறோம்",
    };
    return greetings[currentLanguage.code as keyof typeof greetings] || greetings.en;
  };

  const getSubtitle = () => {
    const subtitles = {
      en: "Your AI assistant for government services and local support",
      hi: "सरकारी सेवाओं और स्थानीय सहायता के लिए आपका AI सहायक",
      te: "ప్రభుత్వ సేవలు మరియు స్థానిక మద్దతు కోసం మీ AI సహాయకుడు",
      ta: "அரசு சேவைகள் மற்றும் உள்ளூர் ஆதரவுக்கான உங்கள் AI உதவியாளர்",
    };
    return subtitles[currentLanguage.code as keyof typeof subtitles] || subtitles.en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Vernacular AI</h1>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector
                isOpen={isLanguageSelectorOpen}
                onToggle={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
                onClose={() => setIsLanguageSelectorOpen(false)}
              />
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */} 
        <Card className="bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6 text-center">
            <h2 className={cn(
              'text-2xl font-bold mb-2',
              currentLanguage.fontClass
            )}>
              {getGreeting()}
            </h2>
            <p className={cn(
              'text-lg opacity-90 mb-4',
              currentLanguage.fontClass
            )}>
              {getSubtitle()}
            </p>
            <Button
              onClick={handleChatClick}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 font-semibold touch-target"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {currentLanguage.code === 'hi' ? 'चैट शुरू करें' :
               currentLanguage.code === 'te' ? 'చాట్ ప్రారంభించండి' :
               currentLanguage.code === 'ta' ? 'அரட்டையைத் தொடங்கு' :
               'Start Chat'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleChatClick}>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className={cn('font-semibold', currentLanguage.fontClass)}>
                {currentLanguage.code === 'hi' ? 'आवाज़ चैट' :
                 currentLanguage.code === 'te' ? 'వాయిస్ చాట్' :
                 currentLanguage.code === 'ta' ? 'குரல் அரட்டை' :
                 'Voice Chat'}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className={cn('font-semibold', currentLanguage.fontClass)}>
                {currentLanguage.code === 'hi' ? 'सरकारी सेवाएं' :
                 currentLanguage.code === 'te' ? 'ప్రభుత్వ సేవలు' :
                 currentLanguage.code === 'ta' ? 'அரசு சேவைகள்' :
                 'Gov Services'}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Government Services */}
        <Card>
          <CardHeader>
            <CardTitle className={cn('flex items-center gap-2', currentLanguage.fontClass)}>
              <FileText className="h-5 w-5 text-primary" />
              {currentLanguage.code === 'hi' ? 'सरकारी सेवाएं' :
               currentLanguage.code === 'te' ? 'ప్రభుత్వ సేవలు' :
               currentLanguage.code === 'ta' ? 'அரசு சேவைகள்' :
               'Government Services'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {GOVERNMENT_SERVICES.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => handleServiceClick(service.id)}
              />
            ))}
            
            <Button variant="outline" className="w-full touch-target">
              {currentLanguage.code === 'hi' ? 'सभी सेवाएं देखें' :
               currentLanguage.code === 'te' ? 'అన్ని సేవలను చూడండి' :
               currentLanguage.code === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்கவும்' :
               'View All Services'}
            </Button>
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className={cn('font-semibold text-orange-800', currentLanguage.fontClass)}>
                    {currentLanguage.code === 'hi' ? 'ऑफ़लाइन मोड' :
                     currentLanguage.code === 'te' ? 'ఆఫ్‌లైన్ మోడ్' :
                     currentLanguage.code === 'ta' ? 'ஆஃப்லைன் பயன்முறை' :
                     'Offline Mode'}
                  </h3>
                  <p className={cn('text-sm text-orange-700', currentLanguage.fontClass)}>
                    {currentLanguage.code === 'hi' ? 'कुछ सेवाएं सीमित हो सकती हैं' :
                     currentLanguage.code === 'te' ? 'కొన్ని సేవలు పరిమితం కావచ్చు' :
                     currentLanguage.code === 'ta' ? 'சில சேவைகள் வரையறுக்கப்படலாம்' :
                     'Some services may be limited'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
