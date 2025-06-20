
import React from 'react';
import { ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GovernmentService } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceCardProps {
  service: GovernmentService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { currentLanguage } = useLanguage();
  const isOnline = navigator.onLine;

  const handleClick = () => {
    if (service.url && isOnline) {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryColor = (category: GovernmentService['category']) => {
    switch (category) {
      case 'documents':
        return 'border-l-blue-500';
      case 'utilities':
        return 'border-l-green-500';
      case 'health':
        return 'border-l-red-500';
      case 'education':
        return 'border-l-purple-500';
      case 'grievance':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95',
        'border-l-4',
        getCategoryColor(service.category),
        !isOnline && 'opacity-60'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 mt-1">
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-lg mb-1 line-clamp-2',
              currentLanguage.fontClass
            )}>
              {service.name}
            </h3>
            <p className={cn(
              'text-sm text-muted-foreground line-clamp-2 mb-2',
              currentLanguage.fontClass
            )}>
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-xs px-2 py-1 rounded-full capitalize',
                'bg-muted text-muted-foreground font-medium',
                currentLanguage.fontClass
              )}>
                {service.category}
              </span>
              <div className="flex items-center gap-1">
                {!isOnline ? (
                  <WifiOff className="h-4 w-4 text-red-500" />
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <Wifi className="h-4 w-4 text-green-500" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
