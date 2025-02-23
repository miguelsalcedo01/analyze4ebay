
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ROIAnalysis } from '@/components/ROIAnalysis';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with actual API call later
const mockApiResponse = (file: File, acquisitionCost: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate ROI based on acquisition cost
      const calculateROI = (sellingPrice: number, fees: number) => {
        const profit = sellingPrice - acquisitionCost - fees;
        const roi = (profit / acquisitionCost) * 100;
        return { profit, roi };
      };

      const lowPrice = 25.00;
      const medPrice = 45.00;
      const highPrice = 75.00;

      const lowFees = lowPrice * 0.13;  // 13% fees
      const medFees = medPrice * 0.13;
      const highFees = highPrice * 0.13;

      const lowROI = calculateROI(lowPrice, lowFees);
      const medROI = calculateROI(medPrice, medFees);
      const highROI = calculateROI(highPrice, highFees);

      resolve({
        options: [
          {
            type: 'Low',
            sellingPrice: lowPrice,
            fees: lowFees,
            profit: lowROI.profit,
            roi: lowROI.roi,
          },
          {
            type: 'Medium',
            sellingPrice: medPrice,
            fees: medFees,
            profit: medROI.profit,
            roi: medROI.roi,
          },
          {
            type: 'High',
            sellingPrice: highPrice,
            fees: highFees,
            profit: highROI.profit,
            roi: highROI.roi,
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

  const handleImageUpload = async (file: File, acquisitionCost: number) => {
    setIsLoading(true);
    try {
      const response = await mockApiResponse(file, acquisitionCost);
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
          Upload an image and enter acquisition cost to analyze potential ROI
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
