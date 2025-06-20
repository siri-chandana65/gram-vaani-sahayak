
import React from 'react';
import { Volume2, User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/hooks/useVoice';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { currentLanguage } = useLanguage();
  const { speak, isSpeaking } = useVoice();

  const handleSpeak = () => {
    speak(message.text);
  };

  return (
    <div className={cn(
      'flex gap-3 mb-4 animate-fade-in',
      message.isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        message.isUser ? 'bg-primary' : 'bg-accent'
      )}>
        {message.isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      
      <Card className={cn(
        'max-w-[80%] p-3',
        message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card'
      )}>
        <div className="space-y-2">
          <p className={cn(
            'text-base leading-relaxed whitespace-pre-wrap',
            currentLanguage.fontClass
          )}>
            {message.text}
          </p>
          
          {message.originalText && message.originalText !== message.text && (
            <p className="text-xs opacity-70 italic">
              Original: {message.originalText}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-60">
              {message.timestamp.toLocaleTimeString()}
            </span>
            
            {!message.isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="h-6 w-6 p-0 hover:bg-white/20"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
