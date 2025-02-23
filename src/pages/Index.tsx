
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ROIAnalysis } from '@/components/ROIAnalysis';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with actual API call later
const mockApiResponse = (file: File) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        options: [
          {
            type: 'Low',
            sellingPrice: 25.00,
            fees: 3.25,
            profit: 11.75,
            roi: 112.5,
          },
          {
            type: 'Medium',
            sellingPrice: 45.00,
            fees: 5.85,
            profit: 29.15,
            roi: 278.6,
          },
          {
            type: 'High',
            sellingPrice: 75.00,
            fees: 9.75,
            profit: 55.25,
            roi: 527.4,
          },
        ],
      });
    }, 1500);
  });
};

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const response = await mockApiResponse(file);
      setAnalysisResults(response);
      toast({
        title: "Analysis Complete",
        description: "Review the ROI options below",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (option: any) => {
    toast({
      title: "Listing Approved",
      description: `Item will be listed at $${option.sellingPrice}`,
    });
  };

  const handleSaveForLater = (option: any) => {
    toast({
      title: "Saved for Later",
      description: "Item has been saved to your drafts",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-4xl font-bold">eBay ROI Analyzer</h1>
        <p className="text-muted-foreground">
          Upload an image to analyze potential ROI for your eBay listings
        </p>
      </div>

      <Card className="p-6 animate-slideIn">
        <ImageUpload onImageUpload={handleImageUpload} />
      </Card>

      {isLoading && (
        <div className="text-center py-12 animate-pulse">
          <p className="text-muted-foreground">Analyzing image...</p>
        </div>
      )}

      {analysisResults && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">ROI Analysis</h2>
          <ROIAnalysis
            options={analysisResults.options}
            onApprove={handleApprove}
            onSaveForLater={handleSaveForLater}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
