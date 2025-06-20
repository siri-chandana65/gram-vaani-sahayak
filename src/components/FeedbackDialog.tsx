
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: currentLanguage.code === 'hi' ? 'धन्यवाद!' :
               currentLanguage.code === 'te' ? 'ధన్యవాదాలు!' :
               currentLanguage.code === 'ta' ? 'நன்றி!' :
               'Thank you!',
        description: currentLanguage.code === 'hi' ? 'आपका फीडबैक सबमिट हो गया है।' :
                     currentLanguage.code === 'te' ? 'మీ ఫీడ్‌బ్యాక్ సమర్పించబడింది.' :
                     currentLanguage.code === 'ta' ? 'உங்கள் கருத்து சமर्பिக्கப्पट्टदु.' :
                     'Your feedback has been submitted.',
      });
      
      setRating(0);
      setFeedback('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={currentLanguage.fontClass}>
            {currentLanguage.code === 'hi' ? 'सेवा फीडबैक' :
             currentLanguage.code === 'te' ? 'సేవా ఫీడ్‌బ్యాక్' :
             currentLanguage.code === 'ta' ? 'சேवै फीडबैक' :
             'Service Feedback'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={cn('text-sm font-medium', currentLanguage.fontClass)}>
              {currentLanguage.code === 'hi' ? 'रेटिंग दें:' :
               currentLanguage.code === 'te' ? 'రేటింగ్ ఇవ్వండి:' :
               currentLanguage.code === 'ta' ? 'मूल्यांकन करें:' :
               'Rate our service:'}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      'h-5 w-5',
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={cn('text-sm font-medium', currentLanguage.fontClass)}>
              {currentLanguage.code === 'hi' ? 'आपकी राय:' :
               currentLanguage.code === 'te' ? 'మీ అభిప్రాయం:' :
               currentLanguage.code === 'ta' ? 'उमगळ् अभिप्राय:' :
               'Your feedback:'}
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                currentLanguage.code === 'hi' ? 'अपनी राय साझा करें...' :
                currentLanguage.code === 'te' ? 'మీ అభిప్రాయాన్ని పంచుకోండి...' :
                currentLanguage.code === 'ta' ? 'उमगळ् अभिप्रायाम् पंगुकोंडि...' :
                'Share your feedback...'
              }
              className={cn('min-h-[100px]', currentLanguage.fontClass)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {currentLanguage.code === 'hi' ? 'रद्द करें' :
               currentLanguage.code === 'te' ? 'రద్దు చేయండి' :
               currentLanguage.code === 'ta' ? 'रद्द करें' :
               'Cancel'}
            </Button>
            <Button type="submit" disabled={loading || rating === 0} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? 
                (currentLanguage.code === 'hi' ? 'भेजा जा रहा है...' :
                 currentLanguage.code === 'te' ? 'పంపుతున్నాము...' :
                 currentLanguage.code === 'ta' ? 'अनुप्पुतुन्नामु...' :
                 'Submitting...') :
                (currentLanguage.code === 'hi' ? 'भेजें' :
                 currentLanguage.code === 'te' ? 'పంపండి' :
                 currentLanguage.code === 'ta' ? 'पंपंडि' :
                 'Submit')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
