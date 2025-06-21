
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MessageCircle, Bot, Wifi, WifiOff, LogOut, Sun, Moon, MessageSquare, Mic, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ServiceCard } from '@/components/ServiceCard';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GOVERNMENT_SERVICES } from '@/data/governmentServices';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { currentLanguage, isLoading } = useLanguage();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Redirect to auth if not logged in
  if (!user && !isLoading) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const getGreeting = () => {
    const greetings = {
      en: "Welcome to GramBot",
      hi: "ग्रामबॉट में आपका स्वागत है",
      te: "గ్రామ్‌బాట్‌కు స్వాగతం",
      ta: "கிராம்பாட் க்கு வরवேற்கிறோम்",
    };
    return greetings[currentLanguage.code as keyof typeof greetings] || greetings.en;
  };

  const getSubtitle = () => {
    const subtitles = {
      en: "Your AI assistant for government services and local support",
      hi: "सरकारी सेवाओं और स्थानीय सहायता के लिए आपका AI सहायक",
      te: "ప్రభుత్వ సేవలు మరియు స్థానిక మద్దతు కోసం మీ AI సహాయకుడు",
      ta: "அரசு சேवைகள் மற்றும் உள்ளூர் ஆதரவுக்கான உங்கள் AI உதவியாளர்",
    };
    return subtitles[currentLanguage.code as keyof typeof subtitles] || subtitles.en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-700">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400">GramBot</h1>
                <div className="flex items-center gap-1 sm:gap-2">
                  {isOnline ? (
                    <Wifi className="h-2 w-2 sm:h-3 sm:w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-2 w-2 sm:h-3 sm:w-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSelector
                isOpen={isLanguageSelectorOpen}
                onToggle={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
                onClose={() => setIsLanguageSelectorOpen(false)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
        {/* Welcome Section */} 
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
            <h2 className={cn(
              'text-xl sm:text-2xl lg:text-3xl font-bold mb-2',
              currentLanguage.fontClass
            )}>
              {getGreeting()}
            </h2>
            <p className={cn(
              'text-base sm:text-lg opacity-90 mb-3 sm:mb-4',
              currentLanguage.fontClass
            )}>
              {getSubtitle()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold touch-target w-full sm:w-auto text-base sm:text-lg px-6 py-3"
                >
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  {currentLanguage.code === 'hi' ? 'चैट शुरू करें' :
                   currentLanguage.code === 'te' ? 'చాట్ ప్రారంభించండి' :
                   currentLanguage.code === 'ta' ? 'அரட்டையைத் தொடங்கு' :
                   'Start Chat'}
                </Button>
              </Link>
              <Link to="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold touch-target w-full sm:w-auto text-base sm:text-lg px-6 py-3"
                >
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  {currentLanguage.code === 'hi' ? 'वॉयस चैट' :
                   currentLanguage.code === 'te' ? 'వాయిస్ చాట్' :
                   currentLanguage.code === 'ta' ? 'குरल் அरட्டै' :
                   'Voice Chat'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <CardTitle className={cn('flex items-center gap-2 text-lg sm:text-xl', currentLanguage.fontClass)}>
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              {currentLanguage.code === 'hi' ? 'सरकारी सेवाएं' :
               currentLanguage.code === 'te' ? 'ప్రభుత్వ సేవలు' :
               currentLanguage.code === 'ta' ? 'अরसु सेवैगळ्' :
               'Government Services'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {GOVERNMENT_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className={cn('font-semibold text-orange-800 dark:text-orange-400', currentLanguage.fontClass)}>
                    {currentLanguage.code === 'hi' ? 'ऑफ़लाइन मोड' :
                     currentLanguage.code === 'te' ? 'ఆఫ్‌లైన్ మోడ్' :
                     currentLanguage.code === 'ta' ? 'आऑफ्लैन् पयन्मुरै' :
                     'Offline Mode'}
                  </h3>
                  <p className={cn('text-sm text-orange-700 dark:text-orange-300', currentLanguage.fontClass)}>
                    {currentLanguage.code === 'hi' ? 'कुछ सेवाएं सीमित हो सकती हैं' :
                     currentLanguage.code === 'te' ? 'కొన్ని సేవలు పరిమితం కావచ్చు' :
                     currentLanguage.code === 'ta' ? 'कोन्नि सेवैगळ् वरैयरुक्कप्पडलाम्' :
                     'Some services may be limited'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Fixed Feedback Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsFeedbackOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label={
            currentLanguage.code === 'hi' ? 'फीडबैक दें' :
            currentLanguage.code === 'te' ? 'ఫీడ్‌బ్యాక్ ఇవ్వండి' :
            currentLanguage.code === 'ta' ? 'करुत्तु तेरिविक्कवुम्' :
            'Give Feedback'
          }
        >
          <MessageCircleMore className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        </Button>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default Index;
