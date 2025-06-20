
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceButton } from './VoiceButton';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';

export const FloatingVoiceButton: React.FC = () => {
  const { isListening, isSpeaking, isSupported } = useVoice();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVoiceClick = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to chat page for voice interaction
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <VoiceButton
        isListening={isListening}
        isSpeaking={isSpeaking}
        onStartListening={handleVoiceClick}
        onStopListening={() => {}}
        className="shadow-lg hover:shadow-xl"
      />
    </div>
  );
};
