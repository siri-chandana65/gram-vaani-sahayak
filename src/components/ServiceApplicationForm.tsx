
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceTitle: string;
}

export const ServiceApplicationForm: React.FC<ServiceApplicationFormProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceTitle,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    additionalInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_applications')
        .insert({
          user_id: user.id,
          service_type: serviceType,
          application_data: formData,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: `Your ${serviceTitle} application has been submitted successfully!`,
      });

      setFormData({ fullName: '', phone: '', address: '', additionalInfo: '' });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormFields = () => {
    switch (serviceType) {
      case 'ration-card':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income</Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter monthly income"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familySize">Family Size</Label>
              <Input
                id="familySize"
                type="number"
                placeholder="Number of family members"
                required
              />
            </div>
          </>
        );
      case 'electricity-bill':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="consumerNumber">Consumer Number</Label>
              <Input
                id="consumerNumber"
                placeholder="Enter consumer number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meterReading">Current Meter Reading</Label>
              <Input
                id="meterReading"
                type="number"
                placeholder="Enter meter reading"
              />
            </div>
          </>
        );
      case 'water-bill':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="connectionNumber">Connection Number</Label>
              <Input
                id="connectionNumber"
                placeholder="Enter water connection number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usage">Monthly Usage (Liters)</Label>
              <Input
                id="usage"
                type="number"
                placeholder="Enter monthly usage"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{serviceTitle} Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              placeholder="Enter your complete address"
            />
          </div>

          {getFormFields()}
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              placeholder="Any additional information (optional)"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
