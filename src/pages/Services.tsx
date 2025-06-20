
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { GOVERNMENT_SERVICES } from '@/data/governmentServices';
import { GovernmentService } from '@/types';
import { cn } from '@/lib/utils';

const Services = () => {
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: { en: 'All', hi: 'सभी', te: 'అన్నీ', ta: 'அனைத्று' } },
    { id: 'documents', name: { en: 'Documents', hi: 'दस्तावेज़', te: 'పత్రాలు', ta: 'ஆவணங்கள்' } },
    { id: 'utilities', name: { en: 'Utilities', hi: 'उपयोगिताएं', te: 'వినియోగాలు', ta: 'பயன்பाடுகள்' } },
    { id: 'health', name: { en: 'Health', hi: 'स्वास्थ्य', te: 'ఆరోగ్యం', ta: 'स्वास्थ्य' } },
    { id: 'education', name: { en: 'Education', hi: 'शिक्षा', te: 'విద్య', ta: 'கல்வি' } },
    { id: 'grievance', name: { en: 'Grievance', hi: 'शिकायत', te: 'ఫిర్యాదు', ta: 'குறை' } },
  ];

  const filteredServices = GOVERNMENT_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGoBack = () => {
    window.history.back();
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name[currentLanguage.code as keyof typeof category.name] || categoryId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className={cn('text-lg font-bold flex-1', currentLanguage.fontClass)}>
              {currentLanguage.code === 'hi' ? 'सरकारी सेवाएं' :
               currentLanguage.code === 'te' ? 'ప్రభుత్వ సేవలు' :
               currentLanguage.code === 'ta' ? 'அரசு சেवைகள்' :
               'Government Services'}
            </h1>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                currentLanguage.code === 'hi' ? 'सेवाएं खोजें...' :
                currentLanguage.code === 'te' ? 'సేవలను వెతకండి...' :
                currentLanguage.code === 'ta' ? 'சेवைகளைத் தேடुங्கल्' :
                'Search services...'
              }
              className={cn('pl-10 h-12', currentLanguage.fontClass)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn('whitespace-nowrap', currentLanguage.fontClass)}
              >
                {getCategoryName(category.id)}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <main className="container mx-auto px-4 py-6">
        {filteredServices.length > 0 ? (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className={cn('text-lg font-semibold mb-2', currentLanguage.fontClass)}>
                {currentLanguage.code === 'hi' ? 'कोई सेवा नहीं मिली' :
                 currentLanguage.code === 'te' ? 'సేవలు కనుగొనబడలేదు' :
                 currentLanguage.code === 'ta' ? 'சেवைगल् காணप्पडवில्लै' :
                 'No services found'}
              </h3>
              <p className={cn('text-muted-foreground', currentLanguage.fontClass)}>
                {currentLanguage.code === 'hi' ? 'अलग खोज शब्दों या श्रेणी को आज़माएं' :
                 currentLanguage.code === 'te' ? 'వేరే వెతుకులాట పదాలు లేదా వర్గాన్ని ప్రయత్నించండి' :
                 currentLanguage.code === 'ta' ? 'वेरे तेडुगुलाट पदांगळ് लेदा वर्गान्नि प्रयत्निंचंडि' :
                 'Try different search terms or category'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-sm text-muted-foreground', currentLanguage.fontClass)}>
                  {currentLanguage.code === 'hi' ? 'कुल सेवाएं' :
                   currentLanguage.code === 'te' ? 'మొత్తం సేవలు' :
                   currentLanguage.code === 'ta' ? 'मुळ सेवैगळ्' :
                   'Total Services'}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {filteredServices.length}
                </p>
              </div>
              <div className="text-right">
                <p className={cn('text-sm text-muted-foreground', currentLanguage.fontClass)}>
                  {currentLanguage.code === 'hi' ? 'श्रेणी' :
                   currentLanguage.code === 'te' ? 'వర్గం' :
                   currentLanguage.code === 'ta' ? 'वर्ग' :
                   'Category'}
                </p>
                <Badge variant="secondary" className={currentLanguage.fontClass}>
                  {getCategoryName(selectedCategory)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Services;
