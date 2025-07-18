
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordValidation } from '@/components/PasswordValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword, validateFullName, validatePhone } from '@/utils/validation';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (isSignUp) {
      if (!validateFullName(formData.fullName)) {
        newErrors.fullName = 'Please enter a valid full name (2-100 characters, letters only)';
      }

      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          {
            full_name: formData.fullName,
            phone: formData.phone,
            location: formData.location,
          }
        );

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          toast({
            title: "Sign In Failed",
            description: error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={cn('text-xl sm:text-2xl', currentLanguage.fontClass)}>
            {isSignUp ? t('signUp') : t('signIn')}
          </CardTitle>
          <CardDescription className={currentLanguage.fontClass}>
            {isSignUp ? t('createAccount') : 'Welcome back to GramBot'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className={currentLanguage.fontClass}>
                  {t('fullName')}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={cn('touch-target', currentLanguage.fontClass)}
                  required
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={currentLanguage.fontClass}>
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn('touch-target', currentLanguage.fontClass)}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={currentLanguage.fontClass}>
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn('touch-target', currentLanguage.fontClass)}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <PasswordValidation password={formData.password} />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={currentLanguage.fontClass}>
                    {t('phone')} (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn('touch-target', currentLanguage.fontClass)}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className={currentLanguage.fontClass}>
                    {t('location')} (Optional)
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={cn('touch-target', currentLanguage.fontClass)}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className={cn('w-full touch-target', currentLanguage.fontClass)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : (isSignUp ? t('createAccount') : t('signIn'))}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className={cn('text-sm', currentLanguage.fontClass)}
            >
              {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
