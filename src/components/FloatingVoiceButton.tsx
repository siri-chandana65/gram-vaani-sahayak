
import React from 'react';
import { VoiceButton } from './VoiceButton';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';

export const FloatingVoiceButton: React.FC = () => {
  const { isListening, isSpeaking, isSupported, startListening, stopListening, speak } = useVoice();
  const { toast } = useToast();

  const handleStartListening = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    startListening(
      (transcript) => {
        // Handle voice input - for now just speak it back
        speak(`You said: ${transcript}`);
        toast({
          title: "Voice Input Received",
          description: transcript,
        });
      },
      (error) => {
        toast({
          title: "Voice Error",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <VoiceButton
        isListening={isListening}
        isSpeaking={isSpeaking}
        onStartListening={handleStartListening}
        onStopListening={stopListening}
        className="shadow-lg hover:shadow-xl"
      />
    </div>
  );
};
