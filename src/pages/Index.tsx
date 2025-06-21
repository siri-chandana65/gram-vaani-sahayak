
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MessageCircle, Bot, WifiOff, LogOut, Sun, Moon, MessageSquare, Mic, MessageCircleMore } from 'lucide-react';
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
  const { currentLanguage, isLoading, t } = useLanguage();
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

  // Get user's name for personalized welcome
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
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
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-green-800 dark:text-green-400">GramBot</h1>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {isOnline ? t('online') : t('offline')}
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
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 touch-target"
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
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 touch-target"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8 pb-24">
        {/* Welcome Section */} 
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6 lg:p-8 text-center space-y-3 sm:space-y-4 lg:space-y-6">
            <h2 className={cn(
              'text-xl sm:text-2xl lg:text-4xl font-bold mb-2',
              currentLanguage.fontClass
            )}>
              {t('welcomeUser', { name: getUserName() })}
            </h2>
            <p className={cn(
              'text-sm sm:text-base lg:text-lg opacity-90 mb-3 sm:mb-4 lg:mb-6',
              currentLanguage.fontClass
            )}>
              {t('welcomeSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center max-w-md mx-auto">
              <Link to="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold touch-target w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 lg:py-4"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2" />
                  {t('startChat')}
                </Button>
              </Link>
              <Link to="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold touch-target w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 lg:py-4"
                >
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2" />
                  {t('voiceChat')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <CardTitle className={cn('flex items-center gap-2 text-lg sm:text-xl lg:text-2xl', currentLanguage.fontClass)}>
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600" />
              {t('governmentServices')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {GOVERNMENT_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className={cn('font-semibold text-orange-800 dark:text-orange-400 text-sm sm:text-base', currentLanguage.fontClass)}>
                    {t('offlineMode')}
                  </h3>
                  <p className={cn('text-xs sm:text-sm text-orange-700 dark:text-orange-300', currentLanguage.fontClass)}>
                    {t('limitedServices')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Fixed Feedback Button - Bottom Right */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={() => setIsFeedbackOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full p-0 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 touch-target"
          aria-label={t('giveFeedback')}
        >
          <MessageCircleMore className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
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
