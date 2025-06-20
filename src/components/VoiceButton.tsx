
import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  disabled = false,
  className,
}) => {
  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative h-16 w-16 rounded-full p-0 touch-target',
        'bg-primary hover:bg-primary-600 active:bg-primary-700',
        'transition-all duration-200 transform active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        {
          'voice-button-active animate-pulse': isListening,
          'bg-accent hover:bg-accent': isSpeaking,
        },
        className
      )}
      aria-label={
        isListening 
          ? 'Stop listening' 
          : isSpeaking 
          ? 'Speaking...' 
          : 'Start voice input'
      }
    >
      {isSpeaking ? (
        <Volume2 className="h-6 w-6 text-white" />
      ) : isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
      
      {isListening && (
        <div className="absolute inset-0 rounded-full border-2 border-primary-300 animate-pulse-ring" />
      )}
    </Button>
  );
};
